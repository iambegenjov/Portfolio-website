
export default function Hero({ count, site }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-mid">
          <h1>
            I'm Muhammet, a brand and digital designer making work people understand at a glance.
            <span className="hero-muted">Identity, retail, systems, education.</span>
          </h1>
          {site.email && (
            <a className="pill light hero-cta" href={`mailto:${site.email}`}>
              {site.ctaButton}
            </a>
          )}
        </div>

        <div className="stats-row">
          <div>
            <span>{count}</span> Featured Projects
          </div>
        </div>
      </div>
    </section>
  );
}
