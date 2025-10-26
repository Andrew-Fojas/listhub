export default function ProgressBar({ value=0 }){
  const pct = Math.round(value * 100);
  return (
    <div style={{display:'grid', gap:'.25rem'}}>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-meta">{pct}% complete</div>
    </div>
  );
}