export interface Product {
  id: number;
  name: string;
  desc: string;
  brand: string;
  price: number;
  category: string;
  releaseDate: string; // dates come as strings from JSON
  available: boolean;
  quantity: number;
  imageName: string;
  imageType: string;
  // imageData is NOT included here — images are fetched separately
  // via /api/product/{id}/image endpoint to avoid huge payloads
}
