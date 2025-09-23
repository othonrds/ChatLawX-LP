type Item = { title: string; desc: string };
type Props = { title: string; subtitle: string; items: Item[] };

export default function WhyChoose({ title, subtitle, items }: Props) {
  return (
    <section id="features" className="section" style={{ paddingTop: 16 }}>
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {items.map((it, i) => (
            <div key={i} style={{ background: 'var(--bg-elev)', border: '1px solid #1f2c49', padding: 16, borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{it.title}</div>
              <div style={{ color: 'var(--muted)' }}>{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

