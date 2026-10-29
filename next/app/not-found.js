import Link from '@/components/SiteLink';

export default function NotFound() {
  return (
    <section className="hero wrap not-found">
      <div className="hero-mid">
        <h1>This page has moved on.</h1>
      </div>
      <div className="stats-row">
        <Link className="pill" href="/">
          Back to the work
        </Link>
      </div>
    </section>
  );
}
