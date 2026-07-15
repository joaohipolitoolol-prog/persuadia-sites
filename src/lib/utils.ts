export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const number = digitsOnly(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function defaultWhatsAppMessage(businessName: string): string {
  return `Olá, encontrei o site da ${businessName} e gostaria de solicitar um orçamento.`;
}

export function defaultAboutText(name: string, city: string): string {
  return `A ${name} oferece serviços de instalação, limpeza e manutenção de ar-condicionado em ${city}. Trabalhamos com atendimento residencial e empresarial, buscando entregar agilidade, segurança e um serviço bem executado.`;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.length === 13 && digits.startsWith("55")) {
    const ddd = digits.slice(2, 4);
    const part1 = digits.slice(4, 9);
    const part2 = digits.slice(9);
    return `(${ddd}) ${part1}-${part2}`;
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
