import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL  as string
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

// ── Types ──────────────────────────────────────────────────────────────────

export type MembershipTier = 'standard' | 'professional' | 'strategic'
export type MemberStatus   = 'pending' | 'active' | 'expired' | 'suspended'
export type RequestStatus  = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id:              string
  full_name:       string
  email:           string
  phone:           string | null
  organization:    string | null
  avatar_url:      string | null
  membership_tier: MembershipTier
  status:          MemberStatus
  activated_at:    string
  expires_at:      string | null
  created_at:      string
}

export interface RegistrationRequest {
  id:              string
  full_name:       string
  email:           string
  phone:           string | null
  organization:    string | null
  role:            string | null
  country:         string | null
  membership_tier: MembershipTier
  message:         string | null
  status:          RequestStatus
  created_at:      string
}

export interface CourseProgress {
  id:           string
  member_id:    string
  course_slug:  string
  lesson_slug:  string
  completed_at: string
}
