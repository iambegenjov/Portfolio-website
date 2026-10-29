import { notFound } from 'next/navigation';
import ProjectView from '@/components/ProjectView';
import { getProjects, projectImage, paragraphs } from '@/lib/projects';

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProjects().find((x) => x.slug === slug);
  if (!p) return {};
  const desc = paragraphs(p.description)[0];
  return {
    title: `${p.title} — Muhammet Begenjov`,
    description: desc,
    openGraph: { title: p.title, description: desc, images: p.cover ? [projectImage(p, p.cover)] : [] },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const projects = getProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  const project = {
    slug: p.slug,
    title: p.title,
    category: p.category,
    tags: p.tags || [],
    paragraphs: paragraphs(p.description),
    cardUrl: projectImage(p, p.card),
    coverUrl: projectImage(p, p.cover),
    rows: (p.gallery || []).map((r) => ({
      type: r.type === 'split' ? 'split' : 'single',
      images: (r.images || []).map((f) => projectImage(p, f)),
    })),
  };

  return <ProjectView key={p.slug} project={project} next={{ slug: next.slug, title: next.title }} />;
}
