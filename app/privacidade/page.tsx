import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Política de Privacidade — Confraria" };

export default function PrivacidadePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
      <Link href="/" className="flex items-center gap-3">
        <Logo className="w-9" />
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.24em] text-gold">
          CONFRARIA
        </span>
      </Link>

      <h1 className="mt-8 font-[family-name:var(--font-display)] text-3xl font-semibold text-text">
        Política de Privacidade
      </h1>

      <div className="mt-3 rounded-xl border border-gold-lo/40 bg-gold/[0.06] p-4 text-sm text-muted">
        ⚠️ Rascunho gerado em 27/07/2026, baseado no que a plataforma realmente coleta hoje. Revisar com
        um advogado antes de publicar de verdade — isso aqui não é aconselhamento jurídico.
      </div>

      <div className="prose-conf mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            1. O que é a Confraria
          </h2>
          <p>
            A Confraria é uma plataforma que conecta porta-vozes (quem tem o vídeo bruto) a editores
            (quem edita), com um inspetor garantindo a qualidade antes da entrega final.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            2. Quais dados coletamos
          </h2>
          <ul className="list-disc pl-5">
            <li>Apelido e e-mail (via login com Google ou cadastro)</li>
            <li>Papel na plataforma (porta-voz, editor ou inspetor) e nível/reputação</li>
            <li>
              <b className="text-text">Só para porta-vozes:</b> um token de autorização do Google Drive,
              limitado aos arquivos que você escolher compartilhar na plataforma (escopo{" "}
              <code>drive.file</code>) — não temos acesso ao seu Drive inteiro
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            3. Para que usamos
          </h2>
          <ul className="list-disc pl-5">
            <li>Autenticar você e identificar seu papel na plataforma</li>
            <li>Calcular nível e reputação a partir do seu histórico de missões</li>
            <li>
              Liberar automaticamente o acesso ao arquivo bruto pro editor que reservou a missão, e
              revogar esse acesso quando o prazo vence ou a missão é entregue/aprovada
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            4. Com quem compartilhamos
          </h2>
          <p>
            Não vendemos nem compartilhamos seus dados com terceiros. O e-mail do editor que reservou
            uma missão é usado exclusivamente para conceder e revogar acesso ao arquivo específico
            daquela missão, no Google Drive do porta-voz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            5. Por quanto tempo guardamos
          </h2>
          <p>
            Enquanto sua conta existir. Se você excluir sua conta, apagamos seus dados pessoais e
            revogamos qualquer autorização de Google Drive vinculada a ela.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            6. Seus direitos (LGPD)
          </h2>
          <p>Você pode, a qualquer momento:</p>
          <ul className="list-disc pl-5">
            <li>Pedir acesso ou correção dos seus dados</li>
            <li>Pedir a exclusão da sua conta e dos seus dados</li>
            <li>Revogar a autorização de acesso ao Google Drive, direto na sua conta Google ou na plataforma</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            7. Segurança
          </h2>
          <p>
            O token de acesso ao Google Drive é armazenado de forma criptografada. Apenas processos
            automatizados da plataforma o utilizam — para conceder e revogar acesso a arquivos
            específicos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
            8. Contato
          </h2>
          <p>
            Dúvidas sobre privacidade: <span className="text-text">[preencher e-mail de contato]</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
