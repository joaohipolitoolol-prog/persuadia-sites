"use client";

import { FormEvent, useMemo, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppButton } from "./WhatsAppButton";
import { WhatsAppIcon } from "./WhatsAppIcon";

const SERVICES = [
  "Instalação de ar-condicionado",
  "Limpeza e higienização",
  "Manutenção preventiva",
  "Manutenção corretiva",
  "Recarga de gás",
  "Atendimento empresarial",
  "Outro / não sei ainda",
];

type ContactFormProps = {
  businessName: string;
  whatsapp: string;
  primaryColor: string;
};

export function ContactForm({
  businessName,
  whatsapp,
  primaryColor,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [neighborhood, setNeighborhood] = useState("");
  const [message, setMessage] = useState("");

  const whatsappHref = useMemo(() => {
    const lines = [
      `Olá, encontrei o site da ${businessName} e gostaria de falar com a equipe.`,
      "",
      `Nome: ${name || "—"}`,
      `Telefone: ${phone || "—"}`,
      `Serviço: ${service}`,
      neighborhood ? `Bairro/cidade: ${neighborhood}` : null,
      message ? `Mensagem: ${message}` : null,
    ].filter(Boolean);

    return buildWhatsAppUrl(whatsapp, lines.join("\n"));
  }, [businessName, whatsapp, name, phone, service, neighborhood, message]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Seu nome
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            placeholder="Como podemos te chamar?"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Telefone / WhatsApp
          </span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            placeholder="(85) 9xxxx-xxxx"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Serviço desejado
          </span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            {SERVICES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Bairro ou cidade
          </span>
          <input
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            placeholder="Ex.: Aldeota, Caucaia…"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Mensagem (opcional)
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          placeholder="Conte um pouco do que precisa — marca do aparelho, urgência, etc."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          style={{ backgroundColor: "#25D366" }}
        >
          <WhatsAppIcon className="h-5 w-5" />
          Enviar pelo WhatsApp
        </button>
        <WhatsAppButton
          href={buildWhatsAppUrl(
            whatsapp,
            `Olá, encontrei o site da ${businessName} e gostaria de solicitar um orçamento.`
          )}
          label="Ou chamar direto"
          color={primaryColor}
          className="text-sm"
        />
      </div>

      <p className="text-xs text-slate-500">
        Ao enviar, abrimos o WhatsApp com sua mensagem pronta. Sem spam e sem
        formulário perdido.
      </p>
    </form>
  );
}
