import { createClient } from '@supabase/supabase-js';

// Tomamos la URL y la clave pública desde el archivo .env.
// Estas variables permiten conectar React con Supabase Storage.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos y exportamos el cliente de Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);