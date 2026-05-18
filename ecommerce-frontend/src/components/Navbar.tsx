import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6 shadow-lg">
      <Link
        to="/"
        className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition"
      >
        🛒 ShopApp
      </Link>

      {/* Search bar — calls GET /api/products/search via HomePage */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-r-lg font-medium transition"
        >
          Search
        </button>
      </form>

      <Link
        to="/add"
        className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
      >
        + Add Product
      </Link>
    </nav>
  );
}
