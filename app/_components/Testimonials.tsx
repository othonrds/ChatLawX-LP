type Item = { name: string; role: string; text: string };
type Props = { title: string; items: Item[] };

export default function Testimonials({ title, items }: Props) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {items.map((t, i) => (
            <blockquote key={i} style={{ background: 'var(--bg-elev)', border: '1px solid #1f2c49', padding: 16, borderRadius: '10px', margin: 0 }}>
              <div style={{ color: '#ffcc00' }}>★★★★★</div>
              <p style={{ margin: '8px 0', color: 'var(--text)' }}>&ldquo;{t.text}&rdquo;</p>
              <footer style={{ color: 'var(--muted)' }}>{t.name} — {t.role}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}


