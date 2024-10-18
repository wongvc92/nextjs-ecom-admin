export enum CheckpointStatus {
  Delivered = "delivered",
  OutForDelivery = "out_for_delivery",
  InTransit = "in_transit",
  InfoReceived = "info_received",
}

export interface Checkpoint {
  time: string; // Date in ISO8601 format
  status: CheckpointStatus; // e.g., 'delivered', 'out_for_delivery'
  content: string; // Description of the event, e.g., 'Delivered'
  location: string; // Location of the event
}

export interface Tracking {
  id: number; // Tracking ID
  note: string | null; // Additional notes (nullable)
  smses: string[]; // Array of SMS notifications
  reason: string | null; // Reason for failure or issue (nullable)
  status: string; // Current status, e.g., 'delivered', 'pending'
  courier: string; // Courier service name, e.g., 'jt'
  order_id: string | null; // Order ID (nullable)
  created_at: string; // ISO8601 format date when tracking was created
  deleted_at: string | null; // ISO8601 format date when tracking was deleted (nullable)
  short_link: string; // Short link to the tracking page
  updated_at: string; // ISO8601 format date when tracking was last updated
  checkpoints: Checkpoint[]; // Array of checkpoints
  order_number: string; // Order number associated with this tracking
  parcel_image: string | null; // URL to parcel image (nullable)
  customer_name: string; // Customer's name
  customer_email: string; // Customer's email
  customer_phone: string; // Customer's phone number
  parcel_content: string; // Description of the parcel's contents
  tracking_number: string; // Tracking number
  latest_checkpoint: Checkpoint | null; // The latest checkpoint, nullable
}
