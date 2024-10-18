export interface Payment {
  shipments: Shipment[];
}

// Shipment interface
export interface Shipment {
  id: number;
  order_number: string;
  status: string;
  tracking: Tracking;
  consignment_url: string;
}

// Tracking interface
export interface Tracking {
  id: number;
  tracking_number: string;
  courier: string;
  order_id: number;
  old_order_id: number;
  order_number: string;
  reason: string | null;
  status: string;
  parcel_content: string;
  parcel_image: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  note: string | null;
  smses: string[];
  short_link: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  latest_checkpoint: string | null;
}
