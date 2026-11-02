
import Rotator from './Rotator';

const FIELDS = ['Identity', 'Retail', 'Systems', 'Education'];

export default function Hero({ count, site }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-mid">
          <h1 aria-label="I'm Muhammet, a brand and digital designer making work people understand at a glance. Identity, retail, systems, education.">
            I'm Muhammet, a brand and digital designer making work people understand at a glance.
            <span className="hero-muted">
              <Rotator words={FIELDS} end="." />
            </span>
          </h1>
          {site.cv ? (
            <a className="pill light hero-cta" href={site.cv} download>
              Download CV
            </a>
          ) : (
            site.email && (
              <a className="pill light hero-cta" href={`mailto:${site.email}`}>
                {site.ctaButton}
              </a>
            )
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
