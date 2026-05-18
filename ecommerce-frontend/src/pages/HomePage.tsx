import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchAllProducts,
  searchProducts,
  deleteProduct,
} from "../api/productApi";
import type { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("search") ?? "";

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Uses native fetch() under the hood via our api layer
      const data = keyword
        ? await searchProducts(keyword)
        : await fetchAllProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever search keyword changes
  useEffect(() => {
    loadProducts();
  }, [keyword]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      // fetch() DELETE call — no axios needed
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Failed to delete");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {keyword && (
        <p className="mb-4 text-gray-600 text-sm">
          Showing results for:{" "}
          <span className="font-semibold text-indigo-600">"{keyword}"</span>
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">
            No products found{keyword ? ` for "${keyword}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
