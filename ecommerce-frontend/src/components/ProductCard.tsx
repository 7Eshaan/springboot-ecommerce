import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import { getImageUrl } from "../api/productApi";

interface Props {
  product: Product;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-200">
      {/* Image is fetched via /api/product/{id}/image — browser handles it as a normal img src */}
      <img
        src={getImageUrl(product.id)}
        alt={product.imageName}
        className="h-48 w-full object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          (e.target as HTMLImageElement).src =
            "https://placehold.co/400x300?text=No+Image";
        }}
      />

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
          {product.category}
        </span>
        <h2 className="text-lg font-bold text-gray-800 mt-1 truncate">
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 truncate">{product.brand}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.desc}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${product.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
          >
            {product.available
              ? `In Stock (${product.quantity})`
              : "Out of Stock"}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
