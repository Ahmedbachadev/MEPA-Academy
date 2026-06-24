import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the 'admin' role to the currently signed-in user IF no admin exists yet.
 * Safe one-time bootstrap — after the first admin exists, this becomes a no-op.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw countErr;
    if ((count ?? 0) > 0) return { claimed: false, reason: "admin_exists" as const };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw error;
    return { claimed: true };
  });
