import { type Product } from "@/types/product";
import { type StaffOrder, type TrackingEvent } from "@/types/order";
import { type Coupon, type Employee, type StockDamageAlert } from "@/types/admin";

export const featuredCategories = [
  { name: "Fruits", image: "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11" },
  { name: "Vegetables", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999" },
  { name: "Dairy", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150" },
  { name: "Bakery", image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec" },
  { name: "Organic", image: "https://images.unsplash.com/photo-1542838132-92c53300491e" }
];

// Mutable list of product categories — admin can extend this
export const productCategories: string[] = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Organic"
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "organic-avocado-hass",
    name: "Organic Hass Avocado",
    category: "Fruits",
    description: "Creamy, ripe, and ideal for toast, salads, and guacamole.",
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad",
    gallery: [
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad",
      "https://images.unsplash.com/photo-1594282486552-05a594abfc7f",
      "https://images.unsplash.com/photo-1603048719539-9ace5a0e7f58"
    ],
    price: 4.2,
    unit: "kg",
    weightLabel: "~250g each",
    inStock: true,
    stockLevel: 48,
    bufferedStock: 8,
    tags: ["Organic", "Vegan", "Gluten-Free", "Dairy-Free"],
    nutrition: {
      calories: "160 kcal",
      protein: "2g",
      carbs: "9g",
      fat: "15g"
    },
    alternates: ["p2", "p3"],
    discount: 10
  },
  {
    id: "p2",
    slug: "wild-blueberries",
    name: "Wild Blueberries",
    category: "Fruits",
    description: "Naturally sweet berries packed with antioxidants.",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e",
    gallery: [
      "https://images.unsplash.com/photo-1498557850523-fd3d118b962e",
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
      "https://images.unsplash.com/photo-1596591868231-05e0f53a74ff"
    ],
    price: 7.8,
    unit: "kg",
    weightLabel: "125g punnet",
    inStock: true,
    stockLevel: 35,
    bufferedStock: 6,
    tags: ["Organic", "Vegan", "Gluten-Free", "Dairy-Free"],
    nutrition: {
      calories: "57 kcal",
      protein: "0.7g",
      carbs: "14g",
      fat: "0.3g"
    }
  },
  {
    id: "p3",
    slug: "farm-spinach",
    name: "Farm Baby Spinach",
    category: "Vegetables",
    description: "Freshly picked, crisp leaves for green bowls and smoothies.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    gallery: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c",
      "https://images.unsplash.com/photo-1615486363972-f79e9a8c7f8c"
    ],
    price: 5.9,
    unit: "kg",
    weightLabel: "200g bag",
    inStock: true,
    stockLevel: 21,
    bufferedStock: 5,
    tags: ["Organic", "Vegan", "Gluten-Free", "Dairy-Free"],
    nutrition: {
      calories: "23 kcal",
      protein: "2.9g",
      carbs: "3.6g",
      fat: "0.4g"
    }
  },
  {
    id: "p4",
    slug: "almond-milk-unsweetened",
    name: "Unsweetened Almond Milk",
    category: "Dairy",
    description: "Barista blend almond milk with silky foam texture.",
    image: "https://images.unsplash.com/photo-1600788907416-456578634209",
    gallery: [
      "https://images.unsplash.com/photo-1600788907416-456578634209",
      "https://images.unsplash.com/photo-1559561853-08451507cbe7",
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4"
    ],
    price: 3.4,
    unit: "bottle",
    weightLabel: "1L bottle",
    inStock: true,
    stockLevel: 62,
    bufferedStock: 10,
    tags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    nutrition: {
      calories: "14 kcal",
      protein: "0.4g",
      carbs: "0.2g",
      fat: "1.2g"
    }
  },
  {
    id: "p5",
    slug: "sourdough-loaf",
    name: "Stoneground Sourdough Loaf",
    category: "Bakery",
    description: "Slow-fermented artisan loaf with crisp crust and airy center.",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73",
    gallery: [
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      "https://images.unsplash.com/photo-1577985051167-0d49eec21977"
    ],
    price: 6.8,
    unit: "pcs",
    weightLabel: "650g loaf",
    inStock: false,
    stockLevel: 0,
    bufferedStock: 2,
    tags: ["Organic"],
    nutrition: {
      calories: "232 kcal",
      protein: "8g",
      carbs: "44g",
      fat: "2g"
    },
    alternates: ["p6"]
  },
  {
    id: "p6",
    slug: "greek-yogurt",
    name: "Greek Yogurt 2%",
    category: "Dairy",
    description: "Thick, creamy cultured yogurt made from local milk.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    gallery: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1505253213348-cd54c92b37e3"
    ],
    price: 4.9,
    unit: "pcs",
    weightLabel: "500g tub",
    inStock: true,
    stockLevel: 17,
    bufferedStock: 3,
    tags: ["Gluten-Free"],
    nutrition: {
      calories: "59 kcal",
      protein: "10g",
      carbs: "3.6g",
      fat: "0.4g"
    }
  }
];

export const promoCards = [
  {
    title: "Green Basket Weekend",
    subtitle: "Save 18% on all organic produce",
    cta: "Claim Offer"
  },
  {
    title: "Bakery Morning Drop",
    subtitle: "Fresh sourdough and pastries before 9:00",
    cta: "Schedule Delivery"
  }
];

export const deliverySlots = [
  { id: "s1", label: "Today 6:00 - 8:00 PM", capacity: "3 spots left", available: true },
  { id: "s2", label: "Tomorrow 8:00 - 10:00 AM", capacity: "12 spots left", available: true },
  { id: "s3", label: "Tomorrow 7:00 - 9:00 PM", capacity: "Full", available: false }
];

export const staffOrders: StaffOrder[] = [
  {
    id: "ORD-2845",
    customerName: "Lina Berg",
    items: 14,
    total: 92.3,
    status: "Pending",
    eta: "22 min",
    requiresWeightAdjustment: true
  },
  {
    id: "ORD-2844",
    customerName: "Noah Lang",
    items: 7,
    total: 41.5,
    status: "Picking",
    eta: "14 min",
    requiresWeightAdjustment: false
  },
  {
    id: "ORD-2843",
    customerName: "Mia Chen",
    items: 11,
    total: 67.9,
    status: "Completed",
    eta: "Courier assigned",
    requiresWeightAdjustment: false
  }
];

export const coupons: Coupon[] = [
  {
    id: "c1",
    code: "FRESH10",
    type: "percentage",
    value: 10,
    minOrderAmount: 20,
    expiresAt: "2026-07-31",
    active: true,
    usageCount: 142,
    usageLimit: 500
  },
  {
    id: "c2",
    code: "SAVE5",
    type: "fixed",
    value: 5,
    minOrderAmount: 30,
    expiresAt: "2026-06-30",
    active: true,
    usageCount: 89,
    usageLimit: 200
  },
  {
    id: "c3",
    code: "ORGANIC18",
    type: "percentage",
    value: 18,
    minOrderAmount: 40,
    expiresAt: "2026-05-31",
    active: false,
    usageCount: 500,
    usageLimit: 500
  }
];

export const employees: Employee[] = [
  {
    id: "e1",
    name: "Sarah Mitchell",
    email: "sarah.m@hybridgrocer.com",
    role: "admin",
    active: true,
    joinedAt: "2024-03-15"
  },
  {
    id: "e2",
    name: "James Okoro",
    email: "james.o@hybridgrocer.com",
    role: "staff",
    active: true,
    joinedAt: "2024-06-01"
  },
  {
    id: "e3",
    name: "Priya Sharma",
    email: "priya.s@hybridgrocer.com",
    role: "staff",
    active: true,
    joinedAt: "2025-01-10"
  },
  {
    id: "e4",
    name: "Tom Bauer",
    email: "tom.b@hybridgrocer.com",
    role: "staff",
    active: false,
    joinedAt: "2023-11-20"
  }
];

export const stockDamageAlerts: StockDamageAlert[] = [
  {
    id: "da1",
    productId: "p5",
    productName: "Stoneground Sourdough Loaf",
    quantityDamaged: 3,
    reason: "Water damage from refrigeration leak",
    affectedOrderIds: ["ORD-2843"],
    notificationSent: true,
    createdAt: "2026-05-28T09:14:00Z"
  },
  {
    id: "da2",
    productId: "p3",
    productName: "Farm Baby Spinach",
    quantityDamaged: 5,
    reason: "Delivery van temperature breach",
    affectedOrderIds: ["ORD-2842", "ORD-2841"],
    notificationSent: false,
    createdAt: "2026-05-29T07:30:00Z"
  }
];

export const trackingEvents: TrackingEvent[] = [
  {
    id: "t1",
    status: "Pending",
    time: "10:24 AM",
    note: "Order confirmed and queued for store picking"
  },
  {
    id: "t2",
    status: "Picking",
    time: "10:40 AM",
    note: "Picker is selecting fresh produce and weight-based items"
  },
  {
    id: "t3",
    status: "Completed",
    time: "11:02 AM",
    note: "All items packed with cold-chain handling"
  }
];
