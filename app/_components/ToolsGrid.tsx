type Item = { title: string; desc: string };
type Props = { title: string; items: Item[] };

export default function ToolsGrid({ title, items }: Props) {
  return (
    <section id="tools" className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {items.map((it, i) => (
            <article key={i} style={{ background: 'var(--bg-elev)', border: '1px solid #1f2c49', padding: 16, borderRadius: '10px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: 16 }}>{it.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)' }}>{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


