import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NOME_COOKIE } from "@/lib/sessao";

export async function POST() {
  const jar = await cookies();
  jar.delete(NOME_COOKIE);
  return NextResponse.json({ ok: true });
}
