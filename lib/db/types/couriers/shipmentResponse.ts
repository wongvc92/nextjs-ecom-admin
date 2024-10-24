export interface ShipmentResponse {
  id: number;
  order_number: string;
  tracking_detail: TrackingDetail;
  parcels: Parcel[];
  parcel_content: string;
  parcel_value: string;
  total_pay: number;
  total_price: number;
  total_weight: number;
  total_volumetric: number;
  is_problem: boolean;
  cancellation_reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_at: string;
  paid_at: string;
  cancelled_at: string | null;
  deleted_at: string | null;
  tracking: Tracking;
  from_address: Address;
  to_address: Address;
  courier: Courier;
  service: Service;
  consignment_url: ConsignmentUrl;
}

export interface TrackingDetail {
  order_id: number | null;
  order_number: string | null;
}

export interface Parcel {
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface Tracking {
  id: number;
  tracking_number: string;
  courier: string;
  order_id: number | null;
  order_number: string | null;
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
  latest_checkpoint: Checkpoint;
  checkpoints: Checkpoint[];
}

export interface Checkpoint {
  time: string;
  status: string;
  content: string;
  location: string;
}

export interface Address {
  name: string;
  phone: string;
  email: string;
  longitude: number | null;
  latitude: number | null;
  address_1: string;
  address_2: string;
  postcode: string;
  city: string;
  province: string;
  country: string;
  full_address: string;
}

export interface Courier {
  id: number;
  handle: string;
  title: string;
  image: string;
}

export interface Service {
  price: number;
  id: number;
  type: string;
  min_parcel: number;
  is_required_printer: boolean;
  min_working_days: number;
  max_working_days: number;
}

export interface ConsignmentUrl {
  a4: string;
  sticker: string;
}
