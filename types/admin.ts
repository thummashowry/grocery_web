export type CouponType = "percentage" | "fixed";

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number; // 0-100 for percentage, dollar amount for fixed
  minOrderAmount: number;
  expiresAt: string; // ISO date string
  active: boolean;
  usageCount: number;
  usageLimit: number;
};

export type EmployeeRole = "admin" | "staff";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  active: boolean;
  joinedAt: string; // ISO date string
};

export type StockDamageAlert = {
  id: string;
  productId: string;
  productName: string;
  quantityDamaged: number;
  reason: string;
  affectedOrderIds: string[];
  notificationSent: boolean;
  createdAt: string;
};
