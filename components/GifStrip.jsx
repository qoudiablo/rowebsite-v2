// Stand-in for the reference layout's row of animated GIFs. Six tiles, each
// with a distinct CSS animation, so the section keeps its rhythm without
// shipping any assets. Replace with real <img src="/gifs/n.gif"> when ready.
export default function GifStrip() {
  return (
    <div className="gifs" aria-hidden="true">
      {['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map((g) => (
        <div key={g} className={`gif ${g}`}><i /></div>
      ))}
    </div>
  );
}
