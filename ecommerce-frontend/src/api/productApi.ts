// native fetch() — no axios

const BASE_URL = "/api";

// GET /api/products
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// GET /api/products/{id}
export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

// GET /api/products/search?keyword=...
export async function searchProducts(keyword: string): Promise<Product[]> {
  // encodeURIComponent handles special chars in keyword safely
  const res = await fetch(
    `${BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`,
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// POST /api/product  — multipart/form-data (product JSON + image file)
export async function addProduct(
  product: Omit<Product, "id">,
  imageFile: File,
): Promise<Product> {
  const formData = new FormData();

  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" }),
  );
  formData.append("imageFile", imageFile);

  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    body: formData,
    // DO NOT set Content-Type here — fetch sets multipart/form-data + boundary automatically
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// PUT /api/product/{id}
export async function updateProduct(
  id: number,
  product: Product,
  imageFile: File,
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" }),
  );
  formData.append("imageFile", imageFile);

  const res = await fetch(`${BASE_URL}/product/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Update failed");
}

// DELETE /api/product/{id}
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

// Image URL helper — returns the endpoint URL for a product's image
export function getImageUrl(productId: number): string {
  return `${BASE_URL}/product/${productId}/image`;
}

import type { Product } from "../types/Product";
