import { useNavigate, Link } from "react-router-dom";
import { addProduct } from "../api/productApi";
import type { Product } from "../types/Product";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleAdd = async (product: Omit<Product, "id">, imageFile: File) => {
    // POST /api/product with multipart/form-data via native fetch()
    await addProduct(product, imageFile);
    navigate("/");
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <Link
        to="/"
        className="text-sm text-indigo-600 hover:underline mb-6 inline-block"
      >
        ← Back to Products
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <ProductForm onSubmit={handleAdd} submitLabel="Add Product" />
      </div>
    </main>
  );
}
