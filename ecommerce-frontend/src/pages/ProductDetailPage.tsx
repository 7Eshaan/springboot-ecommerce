import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchProductById,
  deleteProduct,
  updateProduct,
  getImageUrl,
} from "../api/productApi";
import type { Product } from "../types/Product";
import ProductForm from "../components/ProductForm";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductById(Number(id))
      .then(setProduct)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(Number(id));
    navigate("/");
  };

  const handleUpdate = async (
    updated: Omit<Product, "id">,
    imageFile: File,
  ) => {
    // PUT /api/product/{id} with multipart/form-data via native fetch()
    await updateProduct(Number(id), { ...updated, id: Number(id) }, imageFile);
    navigate("/");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );

  if (!product) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <Link
        to="/"
        className="text-sm text-indigo-600 hover:underline mb-6 inline-block"
      >
        ← Back to Products
      </Link>

      {editing ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
          <ProductForm
            initial={product}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
          <button
            onClick={() => setEditing(false)}
            className="mt-3 text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Image fetched via GET /api/product/{productId}/image — native img src, no blob conversion */}
          <img
            src={getImageUrl(product.id)}
            alt={product.imageName}
            className="md:w-1/2 h-64 md:h-auto object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x400?text=No+Image";
            }}
          />
          <div className="p-8 flex flex-col flex-1">
            <span className="text-xs font-semibold text-indigo-500 uppercase">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{product.brand}</p>
            <p className="text-gray-700 mt-4 leading-relaxed">{product.desc}</p>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p>
                Release Date:{" "}
                <span className="font-medium">{product.releaseDate}</span>
              </p>
              <p>
                Quantity:{" "}
                <span className="font-medium">{product.quantity}</span>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${product.available ? "text-green-600" : "text-red-500"}`}
                >
                  {product.available ? "In Stock" : "Out of Stock"}
                </span>
              </p>
            </div>

            <p className="text-4xl font-bold text-gray-900 mt-6">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
