import { getAdminByToken } from "../admin-db";

/**
 * Extract admin token from request headers or cookies
 */
export function extractAdminToken(req: any): string | null {
  // Check Authorization header
  const authHeader = req.headers?.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Check x-admin-token header
  const adminToken = req.headers?.["x-admin-token"];
  if (adminToken) {
    return adminToken;
  }

  return null;
}

/**
 * Verify admin token and return admin user
 */
export async function verifyAdminToken(token: string) {
  if (!token) return null;
  return await getAdminByToken(token);
}

/**
 * Check if a user has admin privileges (either via OAuth role or admin token)
 */
export async function isUserAdmin(ctx: any): Promise<boolean> {
  // Check OAuth admin role
  if (ctx.user?.role === "admin") {
    return true;
  }

  // Check admin token
  const adminToken = extractAdminToken(ctx.req);
  if (adminToken) {
    const admin = await verifyAdminToken(adminToken);
    return !!admin;
  }

  return false;
}
