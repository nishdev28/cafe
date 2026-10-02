type HeadProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  noIndex?: boolean;
};

export default function HeadMeta({
  title = "Hearth & Grind - Desserts & Beyond",
  description = "Exquisite desserts made with love and premium ingredients. Now with doorstep delivery on Noon and Careem Dubai - United Arab Emirates",
  keywords = "Hearth & Grind, desserts Dubai, premium desserts, gourmet desserts, luxury desserts, jar cakes Dubai, online dessert delivery, Careem Dubai desserts, Noon Dubai desserts, birthday cakes Dubai, chocolate desserts, cheesecake in a jar, pudding jars, dessert catering Dubai, handcrafted desserts, UAE desserts",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noIndex = false,
}: HeadProps) {
  // avoid window.location in SSR
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : canonicalUrl || "";

  return (
    <article>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Robots */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Hearth & Grind" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Additional Meta */}
      <meta name="author" content="Hearth & Grind" />
      <meta name="language" content="en-GB" />

      {/* Structured Data (if provided) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Default Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Hearth & Grind",
            url: "https://hearth-and-grind.vercel.app",
            logo: "https://hearth-and-grind.vercel.app/logo.png",
            description:
              "Exquisite desserts made with love and premium ingredients. Now with doorstep delivery on Noon and Careem Dubai - United Arab Emirates",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+971-50-1234-5678",
              contactType: "customer service",
              email: "info@hearthandgrind.ae",
            },
            sameAs: [
              "https://www.instagram.com/hearthandgrinduae",
              "https://www.facebook.com/HearthAndGrindUAE",
            ],
          }),
        }}
      />
    </article>
  );
}
