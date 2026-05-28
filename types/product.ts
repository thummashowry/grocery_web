export type ProductTag = "Organic" | "Vegan" | "Gluten-Free" | "Dairy-Free";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Organic";
  description: string;
  image: string;
  gallery: string[];
  price: number;
  unit: "kg" | "g" | "pcs" | "bottle";
  weightLabel: string;
  inStock: boolean;
  stockLevel: number;
  bufferedStock: number;
  tags: ProductTag[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
};
