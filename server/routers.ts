import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { assessmentRouter } from "./routers/assessment";
import { activityRouter } from "./routers/activity";
import { adminRouter } from "./routers/admin";
import { adminAuthRouter } from "./routers/admin-auth";
import { recommendationsRouter } from "./routers/recommendations";
import { logActivity } from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      // Log logout activity
      await logActivity({
        userId: ctx.user.id,
        userEmail: ctx.user.email || undefined,
        userName: ctx.user.name || undefined,
        action: "logout",
        description: "User logged out",
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  assessment: assessmentRouter,
  activity: activityRouter,
  admin: adminRouter,
  adminAuth: adminAuthRouter,
  recommendations: recommendationsRouter,
});

export type AppRouter = typeof appRouter;
