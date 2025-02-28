import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mizkymqlgcdhkfowszcr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pemt5bXFsZ2NkaGtmb3dzemNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MzYyOTMsImV4cCI6MjA1NjIxMjI5M30.qhB6oBO9AaVm117XHYJTUFAlLgiXnEkGMz4_q3o7kus';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});