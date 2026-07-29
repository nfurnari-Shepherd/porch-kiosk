import { createClient } from '@supabase/supabase-js'

let _client = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )
  }
  return _client
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabase()[prop]
  }
})
