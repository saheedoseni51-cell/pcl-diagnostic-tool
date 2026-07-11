import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { logActivity } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Store login tracking in request context to avoid cross-request pollution
const loginTracking = new WeakMap<any, Set<number>>();

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);

    // Log login activity once per request/user combination
    if (user) {
      // Get or create the set of logged-in users for this request
      if (!loginTracking.has(opts.req)) {
        loginTracking.set(opts.req, new Set());
      }
      const requestLoggedIn = loginTracking.get(opts.req)!;

      // Only log if this is the first authentication in this request
      if (!requestLoggedIn.has(user.id)) {
        requestLoggedIn.add(user.id);
        // Log asynchronously without blocking the request
        logActivity({
          userId: user.id,
          userEmail: user.email || undefined,
          userName: user.name || undefined,
          action: "login",
          description: "User logged in",
        }).catch((err) => console.error("[Activity Log] Failed to log login:", err));
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
