#!/usr/bin/env node
import "dotenv/config";
import { createAdminSession } from "../server/admin-db.ts";
import { generateInitialAdminCredentials } from "../server/auth-utils.ts";

async function seedAdmin() {
  try {
    console.log("🔐 Seeding initial admin account...\n");

    const { username, temporaryPassword } =
      generateInitialAdminCredentials();

    const sessionToken = await createAdminSession(
      username,
      temporaryPassword
    );

    console.log("✅ Admin account created successfully!\n");
    console.log("📋 Admin Credentials:");
    console.log(`   Username: ${username}`);
    console.log(`   Temporary Password: ${temporaryPassword}\n`);
    console.log("⚠️  IMPORTANT: Save these credentials securely!");
    console.log(
      "   You will be prompted to change the password on first login.\n"
    );
    console.log("🔗 Access the admin panel at:");
    console.log("   https://pcl-diagnostic-tool.vercel.app");
    console.log("   Click 'Admin' button and log in with the credentials above.\n");
  } catch (error) {
    console.error("❌ Error seeding admin account:", error);
    process.exit(1);
  }
}

seedAdmin();
