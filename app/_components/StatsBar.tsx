type Stat = { value: string; label: string };
type Props = { items: Stat[] };

export default function StatsBar({ items }: Props) {
  return (
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="container" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {items.map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg-elev)',
            border: '1px solid #1f2c49',
            padding: '12px 16px',
            borderRadius: '10px'
          }}>
            <div style={{ fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

