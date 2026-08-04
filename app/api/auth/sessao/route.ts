import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/sessao-servidor";

export async function GET() {
  const sessao = await lerSessao();
  if (!sessao) return NextResponse.json(null, { status: 401 });
  return NextResponse.json(sessao);
}
