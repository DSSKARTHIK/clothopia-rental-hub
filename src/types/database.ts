
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  retail_price: number;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  total_stock: number;
  available_stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface Rental {
  id: string;
  product_id: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  rental_id: string;
  payment_method: 'cash_on_delivery' | 'online' | 'upi' | 'net_banking' | 'credit_card' | 'debit_card';
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_address: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at?: string;
}
