export default function ProgressBar({ value=0 }) {
    const pct = Math.round(value * 100);
    return (
      <div aria-label="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        {pct}% complete
      </div>
    );
  }  