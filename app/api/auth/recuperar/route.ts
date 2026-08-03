import { NextResponse } from "next/server";
import { buscarContaPorEmail } from "@/lib/contas";
import { criarTokenRecuperacao } from "@/lib/sessao";
import { emailConfigurado, enviarEmailRecuperacao } from "@/lib/email";

// mensagem sempre igual, exista ou não a conta — evita que alguém descubra
// quais e-mails têm cadastro só tentando recuperar senha
const MENSAGEM_PADRAO = {
  ok: true,
  mensagem: "Se esse e-mail tiver uma conta, mandamos um link de recuperação pra ele.",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email;

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ erro: "Digite seu e-mail." }, { status: 400 });
  }

  if (!emailConfigurado()) {
    return NextResponse.json(
      { erro: "Recuperação de senha ainda não configurada (falta RESEND_API_KEY)." },
      { status: 503 }
    );
  }

  const conta = await buscarContaPorEmail(email);
  if (conta) {
    const token = await criarTokenRecuperacao(conta.id);
    const origem = new URL(request.url).origin;
    const link = `${origem}/redefinir-senha?token=${token}`;
    await enviarEmailRecuperacao(conta.email, conta.nome, link);
  }

  return NextResponse.json(MENSAGEM_PADRAO);
}
