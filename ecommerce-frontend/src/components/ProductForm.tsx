import { useState } from "react";
import type { Product } from "../types/Product";

interface Props {
  initial?: Partial<Product>;
  onSubmit: (product: Omit<Product, "id">, imageFile: File) => Promise<void>;
  submitLabel: string;
}

// Reusable form for both Add and Edit
export default function ProductForm({
  initial = {},
  onSubmit,
  submitLabel,
}: Props) {
  const [form, setForm] = useState({
    name: initial.name ?? "",
    desc: initial.desc ?? "",
    brand: initial.brand ?? "",
    price: initial.price ?? 0,
    category: initial.category ?? "",
    releaseDate: initial.releaseDate ?? "",
    available: initial.available ?? true,
    quantity: initial.quantity ?? 0,
    imageName: "",
    imageType: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // Use FileReader to show local preview — no upload yet
    // This is native browser API, no library needed
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(form as Omit<Product, "id">, imageFile);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="desc"
          value={form.desc}
          onChange={handleChange}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (₹)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Quantity</label>
          <input
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Release Date</label>
          <input
            name="releaseDate"
            type="date"
            value={form.releaseDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Using native checkbox — no custom component needed */}
        <input
          type="checkbox"
          name="available"
          id="available"
          checked={form.available}
          onChange={handleChange}
          className="w-4 h-4 accent-indigo-600"
        />
        <label
          htmlFor="available"
          className="text-sm font-medium text-gray-700"
        >
          Available for sale
        </label>
      </div>

      <div>
        <label className={labelClass}>Product Image</label>
        {/* Native file input — browser handles file picker dialog */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100 cursor-pointer"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-40 w-full object-cover rounded-lg border border-gray-200"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
