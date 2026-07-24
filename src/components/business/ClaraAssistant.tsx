"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const ASSISTANT_NAME = "Clara";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type ClaraAssistantProps = {
  businessName: string;
  city: string;
  state: string;
  whatsapp: string;
  openingHours: string | null;
  address: string | null;
  serviceAreas: string[];
  services: string[];
  primaryColor: string;
};

type ReplyContext = Omit<ClaraAssistantProps, "primaryColor"> & {
  history: ChatMessage[];
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(q: string, words: string[]) {
  return words.some((w) => q.includes(w));
}

function scoreIntent(q: string, patterns: RegExp[], boost = 0) {
  let score = boost;
  for (const p of patterns) {
    if (p.test(q)) score += 2;
  }
  return score;
}

function findMentionedService(q: string, services: string[]) {
  const found = services.find((s) => {
    const n = normalize(s);
    return n.length > 3 && q.includes(n);
  });
  return found ?? null;
}

function findMentionedArea(q: string, areas: string[], city: string) {
  const pool = [...areas, city];
  const found = pool.find((a) => {
    const n = normalize(a);
    return n.length > 3 && q.includes(n);
  });
  return found ?? null;
}

function recentTopics(history: ChatMessage[]) {
  const lastUser = [...history]
    .reverse()
    .find((m) => m.role === "user")
    ?.text;
  return lastUser ? normalize(lastUser) : "";
}

function replyFor(input: string, ctx: ReplyContext): string {
  const q = normalize(input);
  const prev = recentTopics(ctx.history);
  const mentionedService = findMentionedService(q, ctx.services);
  const mentionedArea = findMentionedArea(q, ctx.serviceAreas, ctx.city);
  const areasLabel =
    ctx.serviceAreas.length > 0
      ? ctx.serviceAreas.slice(0, 6).join(", ")
      : `${ctx.city} e região`;
  const servicesLabel =
    ctx.services.slice(0, 5).join(", ") ||
    "instalação, limpeza, manutenção e atendimento empresarial";

  const intents: { id: string; score: number; answer: () => string }[] = [
    {
      id: "greeting",
      score: scoreIntent(q, [
        /^(oi|ola|hey|eai|e ai|bom dia|boa tarde|boa noite)\b/,
        /\b(oi|ola|bom dia|boa tarde|boa noite)\b/,
      ]),
      answer: () =>
        `Oi! Sou a ${ASSISTANT_NAME}, assistente da ${ctx.businessName}. Posso ajudar com serviços, regiões, horário, prazos ou orçamento. O que você precisa?`,
    },
    {
      id: "thanks",
      score: scoreIntent(q, [/\b(obrigad|valeu|thanks|agradeco)\b/]),
      answer: () =>
        `Por nada! Se surgir outra dúvida, é só perguntar — ou chame a ${ctx.businessName} no WhatsApp.`,
    },
    {
      id: "human",
      score: scoreIntent(q, [
        /\b(humano|atendente|pessoa|falar com|quero falar|whatsapp)\b/,
      ]),
      answer: () =>
        `Claro — o atendimento humano é pelo WhatsApp da ${ctx.businessName}. Toque no botão verde abaixo que eu te conecto.`,
    },
    {
      id: "price",
      score: scoreIntent(
        q,
        [
          /\b(orcamento|preco|valor|quanto custa|custa|tabela|barato|caro|pagar|parcel)\b/,
        ],
        mentionedService ? 1 : 0
      ),
      answer: () => {
        if (mentionedService) {
          return `Para ${mentionedService}, o orçamento é sem compromisso e feito sob medida. Me diga a cidade/bairro${
            mentionedArea ? ` (vi que mencionou ${mentionedArea})` : ""
          } — ou mande os detalhes no WhatsApp para um retorno rápido da ${ctx.businessName}.`;
        }
        if (includesAny(q, ["parcel", "cartao", "pix"])) {
          return `As formas de pagamento e valores dependem do serviço. Peça orçamento no WhatsApp da ${ctx.businessName} — eles confirmam opções (PIX, cartão etc.) no seu caso.`;
        }
        return `O orçamento é gratuito e sem compromisso. Me diga o serviço (instalação, limpeza, manutenção…) e a cidade/bairro — ou chame a equipe da ${ctx.businessName} no WhatsApp para um retorno rápido.`;
      },
    },
    {
      id: "install",
      score: scoreIntent(q, [
        /\b(instal|instala|colocar ar|montar ar|split novo)\b/,
        /\b(caminhao|caminhoes|onibus|bau|frota|maquina|veiculo pesad|refrigeracao)\b/,
      ]),
      answer: () => {
        if (
          includesAny(q, [
            "caminhao",
            "caminhoes",
            "onibus",
            "bau",
            "frota",
            "maquina",
            "veiculo",
            "refrigeracao",
          ]) ||
          /misa|pesad/.test(normalize(ctx.businessName))
        ) {
          return `Sim — a ${ctx.businessName} atende refrigeração e ar-condicionado de veículos pesados (caminhões, ônibus e máquinas) em ${
            mentionedArea || ctx.city
          }. Para agendar diagnóstico, o WhatsApp é o caminho mais rápido.`;
        }
        return `Sim — fazemos instalação de ar-condicionado residencial e comercial em ${
          mentionedArea || ctx.city
        } e região. Informe a marca/BTUs se souber; para agendar, o caminho mais rápido é o WhatsApp.`;
      },
    },
    {
      id: "cleaning",
      score: scoreIntent(q, [/\b(limp|higien|lavagem|suj|odor|cheiro)\b/]),
      answer: () =>
        `Sim — oferecemos limpeza e higienização completa (filtros, serpentinas e drenos). Ideal quando o ar está com cheiro, pouco rendimento ou há tempo sem manutenção. Posso te direcionar ao WhatsApp para agendar.`,
    },
    {
      id: "repair",
      score: scoreIntent(q, [
        /\b(manutenc|consert|quebr|nao gel|nao esta gelando|vazament|pingando|barulho|ruido|erro|codigo|recarga|gas|gasto)\b/,
      ]),
      answer: () => {
        if (includesAny(q, ["nao gel", "nao esta gelando", "quente"])) {
          return `Quando não gela, costuma ser falta de gás, filtro sujo, placa ou compressor. A ${ctx.businessName} faz diagnóstico e manutenção corretiva. Descreva o modelo e o sintoma no WhatsApp para orientação.`;
        }
        if (includesAny(q, ["vazament", "pingando", "agua"])) {
          return `Pingando ou vazando água geralmente é dreno entupido ou instalação. Atendemos isso — manda uma foto + endereço no WhatsApp que a equipe orienta.`;
        }
        if (includesAny(q, ["gas", "recarga"])) {
          return `Sim — fazemos verificação de vazamento e recarga de gás quando necessário. Melhor avaliar no local. Chame no WhatsApp para agendar.`;
        }
        return `Atendemos manutenção preventiva e corretiva, além de recarga de gás. Conte um pouco do problema (sintoma + marca/BTUs) no WhatsApp que a equipe orienta o próximo passo.`;
      },
    },
    {
      id: "hours",
      score: scoreIntent(q, [
        /\b(horario|hora|funciona|abre|fecha|quando ab|plantao|fds|fim de semana)\b/,
      ]),
      answer: () =>
        ctx.openingHours
          ? `Nosso horário é: ${ctx.openingHours}. Fora desse período, deixe mensagem no WhatsApp — a ${ctx.businessName} retorna assim que possível.`
          : `O melhor é confirmar o horário pelo WhatsApp da ${ctx.businessName}.`,
    },
    {
      id: "location",
      score: scoreIntent(q, [
        /\b(onde|endereco|localiza|mapa|fica onde|ponto de referencia)\b/,
      ]),
      answer: () =>
        ctx.address
          ? `Estamos em ${ctx.address}. Atendemos também outros municípios da região (${areasLabel}).`
          : `Atendemos ${ctx.city} — ${ctx.state} e região (${areasLabel}).`,
    },
    {
      id: "coverage",
      score: scoreIntent(
        q,
        [
          /\b(regiao|cidade|atende|cobertura|vai ate|atendem)\b/,
          /\b(caucaia|maracanau|eusebio|aquiraz|fortaleza|maranguape)\b/,
        ],
        mentionedArea ? 3 : 0
      ),
      answer: () => {
        if (mentionedArea) {
          const inList =
            normalize(mentionedArea) === normalize(ctx.city) ||
            ctx.serviceAreas.some(
              (a) => normalize(a) === normalize(mentionedArea)
            );
          return inList
            ? `Sim, atendemos ${mentionedArea}! Quer agendar ou pedir orçamento? O WhatsApp é o caminho mais rápido.`
            : `Atendemos principalmente: ${areasLabel}. Sobre ${mentionedArea}, confirme no WhatsApp — muitas vezes conseguimos encaixar.`;
        }
        return `Atendemos: ${areasLabel}. Se sua cidade não estiver na lista, pergunte no WhatsApp — muitas vezes conseguimos encaixar.`;
      },
    },
    {
      id: "services",
      score: scoreIntent(q, [
        /\b(servic|o que faz|oferec|trabalham com|fazem o que)\b/,
      ]),
      answer: () =>
        `Principais serviços da ${ctx.businessName}: ${servicesLabel}. Quer instalação, limpeza, manutenção ou orçamento?`,
    },
    {
      id: "urgency",
      score: scoreIntent(q, [
        /\b(urgencia|urgente|emergencia|hoje|agora|rapido|o mais rapido)\b/,
      ]),
      answer: () =>
        `Para urgência, o melhor é falar agora no WhatsApp da ${ctx.businessName} — eles verificam agenda e encaixe no mesmo dia quando possível.`,
    },
    {
      id: "deadline",
      score: scoreIntent(q, [
        /\b(prazo|demora|quanto tempo|visitas|agenda|agendar|marcar)\b/,
      ]),
      answer: () =>
        `O prazo depende da agenda e do tipo de serviço. Em geral conseguimos encaixar rápido em ${ctx.city} e região. Chame no WhatsApp com a data desejada que confirmam.`,
    },
    {
      id: "brand",
      score: scoreIntent(q, [
        /\b(marca|lg|samsung|electrolux|midea|springer|consul|daikin|fujitsu|carrier|komeco|elgin)\b/,
        /\b(split|cassete|piso teto|janela|inverter|btu|btus)\b/,
      ]),
      answer: () =>
        `Trabalhamos com as principais marcas e tipos (split, inverter etc.). Informe modelo/BTUs no WhatsApp que a ${ctx.businessName} confirma compatibilidade e valor.`,
    },
    {
      id: "warranty",
      score: scoreIntent(q, [/\b(garantia|seguro|nota fiscal|nf)\b/]),
      answer: () =>
        `Serviços com nota e garantia conforme o tipo de trabalho. Detalhes (prazo e cobertura) a equipe confirma no orçamento pelo WhatsApp.`,
    },
    {
      id: "business",
      score: scoreIntent(q, [
        /\b(empresa|comercial|pj|condominio|escritorio|loja|sala comercial)\b/,
      ]),
      answer: () =>
        `Sim — atendemos residencial e comercial (empresas, condomínios, lojas). Para projeto ou manutenção em lote, peça orçamento no WhatsApp da ${ctx.businessName}.`,
    },
  ];

  // Boost continuity: if previous message was about a topic and user replies short
  if (q.length < 24 && prev) {
    if (/orcamento|preco|valor|custa/.test(prev)) {
      const price = intents.find((i) => i.id === "price");
      if (price) price.score += 2;
    }
    if (/limp|higien/.test(prev)) {
      const cleaning = intents.find((i) => i.id === "cleaning");
      if (cleaning) cleaning.score += 2;
    }
  }

  intents.sort((a, b) => b.score - a.score);
  const best = intents[0];

  if (best && best.score >= 2) {
    // Combine soft redirects when two strong intents
    const second = intents[1];
    const primary = best.answer();
    if (second && second.score >= 3 && second.score >= best.score - 1) {
      if (best.id === "price" && second.id === "coverage" && mentionedArea) {
        return `${primary}`;
      }
    }
    return primary;
  }

  if (mentionedService) {
    return `Sobre ${mentionedService}: posso te orientar e a ${ctx.businessName} fecha os detalhes no WhatsApp. Quer orçamento, prazo ou agendamento?`;
  }

  if (mentionedArea) {
    return `Em ${mentionedArea} a ${ctx.businessName} costuma atender. Me diga se precisa de instalação, limpeza ou manutenção — ou chame no WhatsApp.`;
  }

  return `Entendi. Posso esclarecer sobre instalação, limpeza, manutenção, regiões (${areasLabel}), horário ou orçamento. Se preferir falar com a equipe agora, use o WhatsApp da ${ctx.businessName}.`;
}

function AttendantAvatar({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      {/* headset ear cups */}
      <path d="M8.5 18.5c0-6.35 4.9-11.5 11.5-11.5s11.5 5.15 11.5 11.5v2.2c0 .7-.57 1.25-1.25 1.25h-1.1c-.7 0-1.25-.55-1.25-1.25v-2.2c0-4.55-3.5-8.25-8-8.25s-8 3.7-8 8.25v2.2c0 .7-.55 1.25-1.25 1.25h-1.1c-.68 0-1.25-.55-1.25-1.25v-2.2z" />
      <rect x="5.2" y="17.2" width="4.2" height="7.2" rx="2.1" />
      <rect x="30.6" y="17.2" width="4.2" height="7.2" rx="2.1" />
      {/* mic boom */}
      <path
        d="M30.8 24.2c.15 2.4-1.3 4.6-3.6 5.4-.45.15-.9-.2-.9-.67v-.9c0-.28.17-.53.43-.63 1.35-.5 2.25-1.8 2.15-3.3-.03-.45.35-.85.8-.85.46 0 .8.4.82.95z"
        opacity="0.95"
      />
      {/* head silhouette */}
      <circle cx="20" cy="18.5" r="5.2" />
      {/* shoulders */}
      <path d="M10.5 34.5c1.2-4.4 4.8-7 9.5-7s8.3 2.6 9.5 7c.12.45-.22.9-.68.9H11.18c-.46 0-.8-.45-.68-.9z" />
    </svg>
  );
}

export function ClaraAssistant({
  businessName,
  city,
  state,
  whatsapp,
  openingHours,
  address,
  serviceAreas,
  services,
  primaryColor,
}: ClaraAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Oi! Eu sou a ${ASSISTANT_NAME}, assistente da ${businessName}. Posso tirar dúvidas sobre serviços, regiões atendidas e orçamento em ${city}.`,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = buildWhatsAppUrl(
    whatsapp,
    `Olá, falei com a ${ASSISTANT_NAME} no site da ${businessName} e gostaria de solicitar um orçamento.`
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setTyping(true);

    const answer = replyFor(trimmed, {
      businessName,
      city,
      state,
      whatsapp,
      openingHours,
      address,
      serviceAreas,
      services,
      history: nextHistory,
    });

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: answer },
      ]);
      setTyping(false);
    }, 450 + Math.min(800, trimmed.length * 12));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  const suggestions = [
    "Quanto custa o orçamento?",
    "Vocês fazem limpeza?",
    "Quais cidades atendem?",
    "Qual o horário?",
    "É urgente, atendem hoje?",
  ];

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
        style={{ backgroundColor: primaryColor }}
        aria-label={open ? `Fechar ${ASSISTANT_NAME}` : `Falar com ${ASSISTANT_NAME}`}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <span className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#25D366] ring-2 ring-white" />
          </span>
        )}
      </button>

      {/* Painel do chat */}
      <div
        className={`fixed right-4 bottom-20 z-50 w-[min(calc(100vw-2rem),380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 sm:right-6 sm:bottom-24 ${
          open
            ? "translate-y-0 pointer-events-auto opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
            <AttendantAvatar className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{ASSISTANT_NAME}</p>
            <p className="text-xs text-white/80">
              Assistente da {businessName} · online
            </p>
          </div>
        </div>

        <div className="flex h-[min(52vh,380px)] flex-col bg-[#f7f8fa]">
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md text-white"
                      : "rounded-bl-md bg-white text-slate-800 shadow-sm ring-1 ring-black/5"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-400 shadow-sm ring-1 ring-black/5">
                  {ASSISTANT_NAME} está digitando…
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {messages.length < 3 ? (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 py-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida…"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-40"
              style={{ backgroundColor: primaryColor }}
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-slate-100 bg-[#25D366]/10 px-3 py-2.5 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            Falar com a equipe no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
