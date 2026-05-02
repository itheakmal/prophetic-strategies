import HomeworkDetailClient from './HomeworkDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HomeworkDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <HomeworkDetailClient id={id} />;
}
