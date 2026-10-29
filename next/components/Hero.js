
const CHIPS = [
  ['Brand Identity', 'Retail & Environments'],
  ['Logistics & Systems', 'Education'],
];

export default function Hero({ count }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-mid">
          <h1>Design that earns its place.</h1>
        </div>

        <div className="stats-row">
          <div>
            <span>{count}</span> Featured Projects
          </div>
          <div className="chip-rows">
            {CHIPS.map((row, i) => (
              <div className="chips" key={i}>
                {row.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
