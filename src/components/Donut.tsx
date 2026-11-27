interface DonutProps {
  percent: number;
  size?: number;
  label?: string;
}

/** Progress ring from the Groups and Funds wireframes. */
export function Donut({ percent, size = 120, label }: DonutProps) {
  const stroke = size * 0.2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(100, percent));

  return (
    <div
      className="donut"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${value}% of the goal saved`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="donut-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle
          className="donut-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="donut-label" style={{ fontSize: size * 0.2 }}>
        {value}%
      </span>
    </div>
  );
}
