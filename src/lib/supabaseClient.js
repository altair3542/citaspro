import { createClient } from "@supabase/supabase-js"

function requireENV(name) {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisa tus variables de entorno.`);
  }
  return value
}

const supabaseUrl = requireENV("VITE_SUPABASE_URL")
const supabaseAnonKey = requireENV("VITE_SUPABASE_ANON_KEY")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
