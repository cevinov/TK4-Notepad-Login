// notepad/scripts/keepalive.js
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client. Replace with your Supabase URL and Anon Key.
// These should ideally come from environment variables.
const supabaseUrl = "URL";
const supabaseAnonKey = "KEY";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and Anon Key are required. Please set environment variables."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function keepAlive() {
  try {
    const { data, error } = await supabase.from("tk4_notepad").select("*");

    if (error) {
      console.error("Error querying heartbeat table:", error);
      return;
    }

    console.log("Heartbeat successful:", data);
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
}

keepAlive();

setInterval(keepAlive, 60 * 1000); // Run every minute
