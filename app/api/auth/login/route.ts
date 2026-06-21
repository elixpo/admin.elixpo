/**
 * GET /api/auth/login — start the Elixpo Accounts SSO flow.
 * Generates a CSRF `state`, stores it in a short-lived httpOnly cookie, and
 * redirects the browser to accounts.elixpo's /oauth/authorize.
 */

export const runtime = "edge";

import { type NextRequest, NextResponse } from "next/server";
import { randomToken } from "@/lib/crypto";
import { buildAuthorizeUrl } from "@/lib/oauth";
import { STATE_COOKIE } from "@/lib/session";

export async function GET(request: NextRequest) {
    const state = randomToken(24);
    const authorizeUrl = await buildAuthorizeUrl(state);

    const res = NextResponse.redirect(authorizeUrl);
    res.cookies.set(STATE_COOKIE, state, {
        httpOnly: true,
        secure: new URL(request.url).protocol === "https:",
        sameSite: "lax",
        path: "/",
        maxAge: 600, // 10 minutes
    });
    return res;
}
