import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { data as productData } from "@/lib/database";
import { blogData } from "@/lib/blog-database";
import { Link } from "react-router";
import dirham from "@/assets/UAE_Dirham_Symbol.svg";

// Define types
interface Product {
  name: string;
  price: number;
  images: string[];
  slug: string;
  weight: string;
  type: string;
  description: string;
  reviews: number;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
}

interface AboutMatch {
  type: 'about';
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  matchingSections: string[];
}

interface SearchResults {
  products: Product[];
  blogs: Blog[];
  about: AboutMatch | null;
  isLoading: boolean;
  totalCount: number;
}

// About page content for searching
const aboutContent = {
  title: "About Hearth & Grind",
  slug: "about-us",
  type: 'about' as const,
  excerpt: "Learn about our mission, team, and commitment to quality desserts",
  content: "At Hearth & Grind, our mission is to turn every jar into a small work of art layered with flavor, passion, and precision. Inspired by Italian traditions and reimagined for Dubai's dessert lovers, we craft tiramisu in a cloud kitchen that guarantees freshness, consistency, and care in every batch. Using premium ingredients and creative combinations, we bring you unique flavors like Date and Qahwa, Lotus Biscoff, Ferrero Rocher and Pistachio, all handcrafted with love.",
  sections: [
    {
      title: "Why Choose Us",
      content: "We are committed to creating tiramisu that stands apart, beginning with high-quality ingredients sourced for their freshness and flavor. Every jar is carefully handcrafted by our skilled team, bringing together smooth mascarpone, bold coffee, and signature twists like pistachio, qahwa, Ferrero Rocher and Lotus Biscoff for a selection of truly unique flavors. Our cloud-kitchen model ensures each order is prepared with precision and delivered quickly, so you enjoy your dessert at its freshest. From thoughtful recipes to dependable service, we go the extra mile to make every bite memorable."
    },
    {
      title: "Production Process",
      content: "Using the best ingredients for every product and ensuring the best quality in every bite. Before being served, products go through strict inspection to ensure quality standards. Every step in production is carefully monitored to achieve the perfect texture and taste."
    },
    {
      title: "Meet The Founder",
      content: "Moona Menez founded Hearth & Grind out of her love for authentic Tiramisu made with quality ingredients. Her search for a perfectly balanced tiramisu ended when she finally mastered the recipe after a year of experimenting. She is delighted to share this recipe in our carefully crafted jars of the classic tiramisu and a list of growing flavour variations."
    },
    {
      title: "Pure Indulgence",
      content: "Nothing less than perfection in every jar."
    },
    {
      title: "Flavors Built to Impress",
      content: "Unique combinations that delight the senses."
    },
    {
      title: "Quality Standards",
      content: "Strict inspection ensures the best quality in every bite."
    }
  ]
};

// Search function
const searchAllContent = (query: string): SearchResults => {
  const lowercaseQuery = query.toLowerCase().trim();
  
  if (!lowercaseQuery) return { 
    products: [], 
    blogs: [], 
    about: null, 
    isLoading: false, 
    totalCount: 0 
  };
  
  // Search products
  const productResults = productData.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.type.toLowerCase().includes(lowercaseQuery) ||
    product.weight.toLowerCase().includes(lowercaseQuery)
  );
  
  // Search blogs
  const blogResults = blogData.filter(blog =>
    blog.title.toLowerCase().includes(lowercaseQuery) ||
    blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
    blog.content.toLowerCase().includes(lowercaseQuery) ||
    blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    blog.author.toLowerCase().includes(lowercaseQuery)
  );
  
  // Search about page content
  let aboutMatch: AboutMatch | null = null;
  const matchingSections: string[] = [];
  
  // Check main about content
  const mainContentMatches = 
    aboutContent.title.toLowerCase().includes(lowercaseQuery) ||
    aboutContent.excerpt.toLowerCase().includes(lowercaseQuery) ||
    aboutContent.content.toLowerCase().includes(lowercaseQuery);
  
  // Check each section
  aboutContent.sections.forEach(section => {
    if (section.title.toLowerCase().includes(lowercaseQuery) ||
        section.content.toLowerCase().includes(lowercaseQuery)) {
      matchingSections.push(section.title);
    }
  });
  
  // If there's any match in about page
  if (mainContentMatches || matchingSections.length > 0) {
    aboutMatch = {
      type: 'about',
      title: aboutContent.title,
      slug: aboutContent.slug,
      excerpt: aboutContent.excerpt,
      content: matchingSections.length > 0 
        ? `Found in sections: ${matchingSections.join(', ')}`
        : aboutContent.content.substring(0, 150) + '...',
      matchingSections
    };
  }
  
  const totalCount = productResults.length + blogResults.length + (aboutMatch ? 1 : 0);
  
  return {
    products: productResults,
    blogs: blogResults,
    about: aboutMatch,
    isLoading: false,
    totalCount
  };
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<SearchResults>({
    products: [],
    blogs: [],
    about: null,
    isLoading: true,
    totalCount: 0
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ 
        products: [], 
        blogs: [], 
        about: null, 
        isLoading: false, 
        totalCount: 0 
      });
      return;
    }

    const timer = setTimeout(() => {
      const searchResults = searchAllContent(query);
      setResults(searchResults);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">
        Search Results for "{query}"
      </h1>
      <p className="mb-6 text-gray-600">
        Found {results.totalCount} result{results.totalCount !== 1 ? 's' : ''}
      </p>
      
      {results.isLoading ? (
        <div className="py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--color-purple)]"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      ) : (
        <>
          {/* About Page Results - Show First */}
          {results.about && (
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">About Us</h2>
                <Link 
                  to="/about-us" 
                  className="font-medium text-[var(--color-purple)] hover:underline"
                >
                  Visit About Page →
                </Link>
              </div>
              <div className="overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg">
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-purple)]">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 " 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{results.about.title}</h3>
                      <p className="text-sm text-gray-600">{results.about.excerpt}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700">{results.about.content}</p>
                  </div>
                  
                  {results.about.matchingSections.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-800">Matching sections:</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.about.matchingSections.map((section, index) => (
                          <span 
                            key={index} 
                            className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link 
                    to={`/${results.about.slug}`}
                    className="inline-flex items-center font-medium text-[var(--color-purple)] hover:underline"
                  >
                    Read more about our story and mission
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="ml-1 h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Products Section */}
          {results.products.length > 0 && (
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Products ({results.products.length})
                </h2>
                <Link 
                  to="/products/1" 
                  className="font-medium text-[var(--color-purple)] hover:underline"
                >
                  View all products →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {results.products.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/product/${product.slug}`}
                    className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-[var(--color-purple)] transition-colors">
                        {product.name}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 ">
                          <img
                            src={dirham}
                            alt="Dirham"
                            className="h-4 w-4 brightness-0 invert"
                          />
                          <span className="font-medium">{product.price}</span>
                        </div>
                        <span className="text-sm font-medium text-[var(--color-purple)] group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Blogs Section */}
          {results.blogs.length > 0 && (
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Blog Posts ({results.blogs.length})
                </h2>
                <Link 
                  to="/blogs" 
                  className="font-medium text-[var(--color-purple)] hover:underline"
                >
                  View all blogs →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {results.blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.slug}`}
                    className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute top-3 left-3">
                        <span className="rounded bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                          Blog
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-[var(--color-purple)]">
                        {blog.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-gray-600">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>By {blog.author}</span>
                          <span>•</span>
                          <span>{new Date(blog.date).toLocaleDateString()}</span>
                        </div>
                        <span className="font-medium text-[var(--color-purple)] group-hover:underline">
                          Read Post →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {results.totalCount === 0 && query && (
            <div className="py-10 text-center">
              <div className="mb-4 text-lg text-gray-500">
                No results found for "{query}"
              </div>
              <div className="mx-auto max-w-md text-gray-600">
                <p className="mb-4">Suggestions:</p>
                <ul className="space-y-2 text-left">
                  <li>• Try different keywords</li>
                  <li>• Check for spelling errors</li>
                  <li>• Browse our <Link to="/products/1" className="text-[var(--color-purple)] hover:underline">products</Link></li>
                  <li>• Read our <Link to="/blogs" className="text-[var(--color-purple)] hover:underline">blogs</Link></li>
                  <li>• Learn more <Link to="/about-us" className="text-[var(--color-purple)] hover:underline">about us</Link></li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}