import { NextRequest, NextResponse } from "next/server";
import { verifyAccountCredentials, createSessionForAccount } from "@/lib/storage";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    }

    const account = await verifyAccountCredentials(email, password);
    if (!account) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const session = await createSessionForAccount(account.id);
    const res = NextResponse.json({ ok: true, name: account.name });
    res.cookies.set(SESSION_COOKIE, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
