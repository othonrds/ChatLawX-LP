type Item = { q: string; a: string };
type Props = { title: string; items: Item[] };

export default function FAQ({ title, items }: Props) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {items.map((it, i) => (
            <details key={i} style={{ background: 'var(--bg-elev)', border: '1px solid #1f2c49', borderRadius: '10px', padding: '8px 12px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{it.q}</summary>
              <p style={{ margin: '8px 0 0 0', color: 'var(--muted)' }}>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


