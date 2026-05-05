import { allFundTopics, getFundTask } from "@/data/fundamentals";
import { notFound } from "next/navigation";
import { CodingTerminal } from "@/components/CodingTerminal";

export function generateStaticParams() {
  const params: { subject: string; slug: string; taskSlug: string }[] = [];
  allFundTopics.forEach((topic) => {
    topic.tasks.forEach((task) => {
      params.push({ subject: topic.subject, slug: topic.slug, taskSlug: task.slug });
    });
  });
  return params;
}

export default async function FundProblemPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string; taskSlug: string }>;
}) {
  const { subject, slug, taskSlug } = await params;
  const result = getFundTask(subject, slug, taskSlug);
  if (!result) notFound();

  const { topic, task } = result;
  const topicExplanation = [
    topic.description,
    topic.realWorldUse ? `## Real-World Systems\n\n${topic.realWorldUse}` : null,
    topic.systems?.length ? `Systems: ${topic.systems.join(", ")}` : null,
    task.whyImplement ? `## Why Implement This\n\n${task.whyImplement}` : null,
  ].filter(Boolean).join("\n\n");

  return (
    <CodingTerminal
      title={task.title}
      difficulty={task.difficulty}
      description={task.description}
      skeleton={task.skeleton}
      tests={task.tests}
      backHref={`/fundamentals/${subject}/${slug}`}
      taskSlug={taskSlug}
      topicExplanation={topicExplanation}
    />
  );
}
