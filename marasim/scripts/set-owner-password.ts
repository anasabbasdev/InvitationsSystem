/**
 * Set or create an owner Auth user password (local / ops).
 *
 *   npx tsx scripts/set-owner-password.ts anas.hub95@gmail.com
 *   OWNER_RESET_PASSWORD='...' npx tsx scripts/set-owner-password.ts anas.hub95@gmail.com
 */
import { randomBytes } from "node:crypto";
import { loadProjectEnv } from "@/lib/env/load-dotenv";
import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import { addEventOwner, fetchInvitationBySlug } from "@/lib/repositories";

loadProjectEnv();

function generatePassword(): string {
  return `Ml-${randomBytes(5).toString("base64url")}`;
}

async function main() {
  const email = (process.argv[2] ?? process.env.OWNER_RESET_EMAIL ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Usage: npx tsx scripts/set-owner-password.ts owner@email.com");
    process.exit(1);
  }

  const password = (process.env.OWNER_RESET_PASSWORD ?? "").trim() || generatePassword();
  const admin = createSupabaseAdminClient();
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  let user = list.users.find((u) => u.email?.toLowerCase() === email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      console.error("createUser failed:", error?.message);
      process.exit(1);
    }
    user = data.user;
    console.log(`created user ${email}`);
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (error) {
      console.error("updateUser failed:", error.message);
      process.exit(1);
    }
    console.log(`updated password for ${email}`);
  }

  const invitation = await fetchInvitationBySlug("mhmd_lara");
  if (invitation?.event_id) {
    await addEventOwner(invitation.event_id, user.id);
    console.log(`linked owner to event ${invitation.event_id}`);
  }

  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const { data: linkData } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/auth/callback?next=/owner/update-password` },
  });

  console.log("");
  console.log("Login:   " + origin + "/owner/login");
  console.log("Email:   " + email);
  console.log("Password:" + password);
  if (linkData.properties?.action_link) {
    console.log("Recovery link (optional):");
    console.log(linkData.properties.action_link);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
