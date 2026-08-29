// Horizontal marquee of "stills" — v2: rounded tiles, soft pastel gradients
// seeded from the tile index. Swap for real frame exports by giving each
// still an `img` and rendering a background-image (imgproxyUrl() in lib/cms.js
// once that server exists).
export default function Strip({ stills, reverse = false }) {
  const Tile = ({ s, i }) => (
    <div
      className="tile"
      data-label={s.label}
      style={{ '--h': (i * 47 + 140) % 360 }}
    >
      <span>{String(i + 1).padStart(2, '0')}</span>
    </div>
  );

  return (
    <div className={`strip${reverse ? ' reverse' : ''}`} aria-hidden="true">
      <div className="strip-track">
        {stills.map((s, i) => <Tile key={`a-${i}`} s={s} i={i} />)}
        {stills.map((s, i) => <Tile key={`b-${i}`} s={s} i={i} />)}
      </div>
    </div>
  );
}
