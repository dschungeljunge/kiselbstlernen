import { DIMENSIONS } from "@/lib/reflexion-redesign";

export interface PublicDimensionRating {
  code: string;
  title: string;
  rating: number;
}

export interface PublicSammlungListItem {
  id: string;
  title: string;
  summary: string;
  beruf: string;
  fachbereich: string;
  thema: string;
  tools: string[];
  dimensions: PublicDimensionRating[];
  publishedAt: string | null;
}

export interface PublicSammlungDetail extends PublicSammlungListItem {
  ziel: string;
  dauer: string;
  sozialform: string;
  besonderheiten: string;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toToolList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

export function mapLessonToPublicListItem(
  item: Record<string, unknown>,
): PublicSammlungListItem {
  const phase1 = (item.phase1 ?? {}) as Record<string, unknown>;
  const dimensions = (item.dimensions ?? {}) as Record<string, { rating?: number }>;

  return {
    id: toStringValue(item.id),
    title: toStringValue(item.title),
    summary: toStringValue(item.final_summary) || toStringValue(item.summary),
    beruf: toStringValue(phase1.beruf),
    fachbereich: toStringValue(phase1.fachbereich),
    thema: toStringValue(phase1.thema),
    tools: toToolList(phase1.tools),
    dimensions: DIMENSIONS.map((dimension) => ({
      code: dimension.code,
      title: dimension.title,
      rating: dimensions[dimension.code]?.rating ?? 0,
    })),
    publishedAt: toStringValue(item.published_at) || toStringValue(item.created_at) || null,
  };
}

export function mapLessonToPublicDetail(
  item: Record<string, unknown>,
): PublicSammlungDetail {
  const phase1 = (item.phase1 ?? {}) as Record<string, unknown>;
  const base = mapLessonToPublicListItem(item);
  return {
    ...base,
    ziel: toStringValue(phase1.ziel),
    dauer: toStringValue(phase1.dauer),
    sozialform: toStringValue(phase1.sozialform),
    besonderheiten: toStringValue(phase1.besonderheiten),
  };
}
