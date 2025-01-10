import { Database } from './database'

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type FunctionArgs<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]['Args']
export type FunctionReturns<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]['Returns']

// Helper type for handling nullable fields
export type Nullable<T> = T | null

// Helper type for handling optional fields
export type Optional<T> = T | undefined

// Helper type for handling array fields
export type ArrayField<T> = T[]

// Helper type for handling date fields
export type DateField = string | Date

// Helper type for handling JSON fields
export type JsonField = Database['public']['Tables'][keyof Database['public']['Tables']]['Row'][keyof Database['public']['Tables'][keyof Database['public']['Tables']]['Row']]