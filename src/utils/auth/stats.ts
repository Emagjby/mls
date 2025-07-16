import { createClient } from "@/utils/supabase/client";

export async function getUserStats(userId: string) {
  const supabase = createClient();

  const { data: stats, error } = await supabase.rpc("get_user_stats", {
    user_uuid: userId,
  });

  if (error) console.error(error);

  return { stats, error };
}
