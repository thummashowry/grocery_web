export type OrderStatus = "Pending" | "Picking" | "Completed" | "Delivered";

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
