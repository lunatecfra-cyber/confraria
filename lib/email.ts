import { Resend } from "resend";

function cliente() {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) throw new Error("RESEND_API_KEY não configurado (.env.local)");
  return new Resend(chave);
}

export function emailConfigurado() {
  return !!process.env.RESEND_API_KEY;
}

// remetente padrão do Resend enquanto o domínio próprio não está verificado
// lá — trocar pra algo em oficinaamarela.com.br assim que o DNS propagar
const REMETENTE = "Oficina Amarela <onboarding@resend.dev>";

export async function enviarEmailRecuperacao(destino: string, nome: string, link: string) {
  await cliente().emails.send({
    from: REMETENTE,
    to: destino,
    subject: "Recuperar sua senha — Oficina Amarela",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1c1c22;">
        <h1 style="font-size: 20px; color: #a9840e;">Oficina Amarela</h1>
        <p>Oi, ${nome}.</p>
        <p>Pediram pra redefinir a senha dessa conta. Se não foi você, ignora esse e-mail.</p>
        <p style="margin: 28px 0;">
          <a href="${link}" style="background: #f4ce1f; color: #1a1405; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Escolher nova senha
          </a>
        </p>
        <p style="font-size: 13px; color: #666;">Esse link expira em 30 minutos.</p>
      </div>
    `,
  });
}
