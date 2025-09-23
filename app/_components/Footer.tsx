type Link = { label: string; href: string };
type Props = {
  product: string;
  legal: string;
  social: string;
  links: { product: Link[]; legal: Link[]; social: Link[] };
};

export default function Footer({ product, legal, social, links }: Props) {
  return (
    <footer className="section" style={{ paddingBottom: 48 }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>{product}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {links.product.map((l, i) => (
              <li key={i} style={{ marginBottom: 6 }}><a className="btn btn-outline" href={l.href} style={{ padding: '6px 10px' }}>{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>{legal}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {links.legal.map((l, i) => (
              <li key={i} style={{ marginBottom: 6 }}><a className="btn btn-outline" href={l.href} style={{ padding: '6px 10px' }}>{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>{social}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {links.social.map((l, i) => (
              <li key={i} style={{ marginBottom: 6 }}><a className="btn btn-outline" href={l.href} style={{ padding: '6px 10px' }}>{l.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: 16, color: 'var(--muted)', fontSize: 12 }}>
        © {new Date().getFullYear()} LawX — Todos os direitos reservados
      </div>
    </footer>
  );
}


