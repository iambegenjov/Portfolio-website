import { asset } from '@/lib/paths';
import Rotator from './Rotator';

const PLACES = ['United Kingdom', 'United States', 'United Arab Emirates'];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-box about-grid">
          <p className="eyebrow">About</p>
          <div className="about-text">
            <img className="about-photo" src={asset('/about/muhammet.jpg')} alt="Muhammet Begenjov" width="640" height="640" loading="lazy" />
            <h2 aria-label="A graphic designer from Turkmenistan, working with brands in the United Kingdom, the United States and the United Arab Emirates.">
              A graphic designer from Turkmenistan, working with{' '}
              <span className="nowrap">
                brands in the <Rotator words={PLACES} end="." />
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
