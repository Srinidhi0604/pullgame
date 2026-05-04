import { OpenPaperReader } from "@/components/OpenPaperReader";
import { papers } from "@/data/papers";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return papers.map((paper) => ({ slug: paper.slug }));
}

export default async function PaperReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = papers.find((item) => item.slug === slug);
  if (!paper) notFound();

  const paperSummaries = papers.map((item) => ({
    slug: item.slug,
    title: item.title,
    authors: item.authors,
    tags: item.tags,
    description: item.description,
    year: item.year,
  }));

  return <OpenPaperReader key={paper.slug} paper={paper} papers={paperSummaries} />;
}
