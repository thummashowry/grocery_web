export type OrderStatus = "Pending" | "Picking" | "Completed" | "Delivered" | "Cancelled" | "PartiallyFulfilled";

export type CustomerNotification = {
  orderId: string;
  productId: string;
  productName: string;
  reason: string; // e.g. "Damaged stock discovered during picking"
  alternateProductIds: string[];
  sentAt: string;
};

export type TrackingEvent = {
  id: string;
  status: OrderStatus;
  time: string;
  note: string;
};

export type StaffOrder = {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: OrderStatus;
  eta: string;
  requiresWeightAdjustment: boolean;
};
