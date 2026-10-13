import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/ecom/server"}/wp-json/wc/v3`;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

function normalizeImageUrls(data: any): any {
  if (!data) return data;
  if (typeof data === "string") {
    return data.replace(/https:\/\/(localhost|127\.0\.0\.1)/g, "http://localhost");
  }
  if (Array.isArray(data)) {
    return data.map(normalizeImageUrls);
  }
  if (typeof data === "object") {
    const copy: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      copy[key] = normalizeImageUrls(data[key]);
    }
    return copy;
  }
  return data;
}

export const api = {
  get: async (endpoint: string, params: Record<string, any> = {}) => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const response = await axios.get(`${baseURL}/${cleanEndpoint}`, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        ...params,
      },
      timeout: 10000,
    });
    return {
      status: response.status,
      data: normalizeImageUrls(response.data),
      headers: response.headers,
    };
  },
  post: async (endpoint: string, data: any = {}, params: Record<string, any> = {}) => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const response = await axios.post(`${baseURL}/${cleanEndpoint}`, data, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        ...params,
      },
      timeout: 10000,
    });
    return {
      status: response.status,
      data: normalizeImageUrls(response.data),
      headers: response.headers,
    };
  },
  put: async (endpoint: string, data: any = {}, params: Record<string, any> = {}) => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const response = await axios.put(`${baseURL}/${cleanEndpoint}`, data, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        ...params,
      },
      timeout: 10000,
    });
    return {
      status: response.status,
      data: normalizeImageUrls(response.data),
      headers: response.headers,
    };
  },
  delete: async (endpoint: string, params: Record<string, any> = {}) => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const response = await axios.delete(`${baseURL}/${cleanEndpoint}`, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        ...params,
      },
      timeout: 10000,
    });
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  },
};

export default api;

// Type definitions for WooCommerce data structures
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  manage_stock: boolean;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  variations: number[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: {
    id: number;
    src: string;
    alt: string;
  } | null;
  count: number;
}

export interface WooCommerceOrder {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    sku: string;
    price: number;
    image: {
      src: string;
    };
  }>;
  shipping_lines: Array<{
    id: number;
    method_title: string;
    method_id: string;
    total: string;
    total_tax: string;
  }>;
  coupon_lines: Array<{
    id: number;
    code: string;
    discount: string;
    discount_tax: string;
  }>;
}

export interface WooCommerceCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  avatar_url: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: any;
  }>;
}
