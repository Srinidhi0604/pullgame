import { papers, getTaskBySlug } from "@/data/papers";
import { notFound } from "next/navigation";
import { CodingTerminal } from "@/components/CodingTerminal";

export function generateStaticParams() {
  const params: { slug: string; taskSlug: string }[] = [];
  papers.forEach((paper) => {
    paper.tasks.forEach((task) => {
      params.push({ slug: paper.slug, taskSlug: task.slug });
    });
  });
  return params;
}

export default async function CodingPage({
  params,
}: {
  params: Promise<{ slug: string; taskSlug: string }>;
}) {
  const { slug, taskSlug } = await params;
  const result = getTaskBySlug(slug, taskSlug);
  if (!result) notFound();

  const { paper, task } = result;

  return (
    <CodingTerminal
      title={task.title}
      difficulty={task.difficulty}
      description={task.description}
      skeleton={task.skeleton}
      tests={task.tests}
      backHref={`/papers/${paper.slug}`}
      taskSlug={taskSlug}
    />
  );
}
