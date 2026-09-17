import { NextRequest, NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const company = String(body?.company ?? "").trim();
    const teamSize = String(body?.teamSize ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid work email." }, { status: 400 });
    }
    if (!company || company.length > 120) {
      return NextResponse.json({ error: "Please enter your company." }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Message is too long (2000 characters max)." }, { status: 400 });
    }

    const saved = await saveContactSubmission({ name, email, company, teamSize, message });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch {
    return NextResponse.json(
      { error: "Could not submit right now. Please try again." },
      { status: 500 }
    );
  }
}
