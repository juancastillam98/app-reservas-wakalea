// Wakalea — Database types

export interface Region {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface ItineraryStep {
  time: string
  title: string
  description: string
}

export interface Experience {
  id: string
  title: string
  slug: string
  subtitle: string | null
  description: string
  short_description: string | null
  region_id: string
  category_id: string
  price_cents: number
  original_price_cents: number | null
  currency: string
  duration_hours: number
  max_guests: number
  min_age: number
  location: string | null
  latitude: number | null
  longitude: number | null
  images: string[]
  includes: string[]
  excludes: string[]
  highlights: string[]
  itinerary: ItineraryStep[]
  rating: number
  review_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined relations (optional)
  regions?: Region
  categories?: Category
}

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: 'client' | 'admin'
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  experience_id: string
  booking_date: string
  guests: number
  total_cents: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_method: string
  payment_reference: string | null
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined
  experiences?: Experience
}

export interface Lead {
  id: string
  email: string
  name: string | null
  source: string
  created_at: string
}
