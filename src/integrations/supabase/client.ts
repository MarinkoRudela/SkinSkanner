import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyqidjgbnmdiirdhgtgs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cWlkamdibm1kaWlyZGhndGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NjE0NDAsImV4cCI6MjAyNjAzNzQ0MH0.vxfqFYmHBa5n_5Br1y0T3TK-2Xg8GR_3XwNxpwQr1kY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)