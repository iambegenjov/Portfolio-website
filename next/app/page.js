import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Works from '@/components/Works';
import Events from '@/components/Events';
import About from '@/components/About';
import DarkFlip from '@/components/DarkFlip';
import { getProjects, projectImage } from '@/lib/projects';
import { getEvents } from '@/lib/events';

export default function Home() {
  const projects = getProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    cardUrl: projectImage(p, p.card),
  }));

  return (
    <>
      <DarkFlip />
      <Hero count={projects.length} />
      <About />
      <Works projects={projects} />
      {getEvents().map((event, i) => (
        <Events key={event.slug} event={event} first={i === 0} />
      ))}
      <Services />
    </>
  );
}
