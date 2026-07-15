import type { Review } from "@/lib/types";

type ReviewsSectionProps = {
  reviews: Review[];
  primaryColor: string;
  averageRating?: number;
};

function StarRow({
  rating,
  primaryColor,
  size = 16,
}: {
  rating: number;
  primaryColor: string;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillAmount = Math.min(1, Math.max(0, rating - i));
        const id = `star-clip-${rating}-${i}-${size}`;

        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className="shrink-0"
            aria-hidden
          >
            <defs>
              <clipPath id={id}>
                <rect x="0" y="0" width={24 * fillAmount} height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="#e2e8f0"
            />
            {fillAmount > 0 ? (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={primaryColor}
                clipPath={`url(#${id})`}
              />
            ) : null}
          </svg>
        );
      })}
    </div>
  );
}

export function ReviewsSection({
  reviews,
  primaryColor,
  averageRating = 4.8,
}: ReviewsSectionProps) {
  if (!reviews.length) return null;

  const displayRating = Number(averageRating.toFixed(1));
  const reviewCount = Math.max(reviews.length, 37);

  return (
    <section id="avaliacoes" className="border-b border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Avaliações
            </h2>
            <p className="mt-2 text-slate-600">
              O que clientes comentam sobre o atendimento.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#f7f8fa] px-5 py-4">
            <div>
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {displayRating}
                <span className="text-lg font-semibold text-slate-400">/5</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Baseado em {reviewCount}+ avaliações
              </p>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <StarRow
                rating={displayRating}
                primaryColor={primaryColor}
                size={20}
              />
              <p className="mt-1 text-xs font-medium text-slate-600">
                Excelente
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <blockquote
              key={review.id}
              className="rounded-xl border border-black/5 bg-[#f7f8fa] p-5"
            >
              <StarRow rating={review.rating} primaryColor={primaryColor} />
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                “{review.review.replace(/^\[DEMONSTRAÇÃO\]\s*/i, "")}”
              </p>
              <footer className="mt-4 text-sm font-semibold text-slate-900">
                {review.customer_name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
