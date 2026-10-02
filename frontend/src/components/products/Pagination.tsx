import { Link } from "react-router-dom";

interface PaginationProps {
  id: number;
  totalPages?: number; // Optional: if you want to control total pages
}

const Pagination = ({ id, totalPages = 5 }: PaginationProps) => {
  // Create an array of page numbers from 1 to totalPages
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="my-6 flex justify-center items-center gap-3">
      {pageNumbers.map((page) => (
        <Link
          key={page}
          to={`/products/${page}`}
          className={`rounded-3xl size-10 justify-center items-center flex  transition-colors duration-200 ${
            id === page
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-500/60 hover:bg-gray-500"
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;