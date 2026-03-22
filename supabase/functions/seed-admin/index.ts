import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const adminEmail = "admin@chainticket.com";
  const adminPassword = "admin123";

  // Check if admin already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const adminExists = existingUsers?.users?.some((u) => u.email === adminEmail);

  if (adminExists) {
    return new Response(
      JSON.stringify({ message: "Admin already exists" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Create admin user
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { full_name: "Admin" },
  });

  if (createError) {
    return new Response(
      JSON.stringify({ error: createError.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // The trigger creates the profile and assigns 'attendee' role.
  // Now upgrade to admin role.
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .update({ role: "admin" })
    .eq("user_id", newUser.user.id);

  if (roleError) {
    return new Response(
      JSON.stringify({ error: roleError.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ message: "Admin created successfully", email: adminEmail }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
