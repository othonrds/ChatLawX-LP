type Props = {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export default function HeroSection({ title, subtitle, ctaPrimary, ctaSecondary }: Props) {
  return (
    <section className="section" style={{ paddingTop: 72 }}>
      <div className="container">
        <h1 style={{ margin: 0, fontSize: 40, textAlign: 'center' }}>{title}</h1>
        <p className="section-subtitle" style={{ marginTop: 16 }}>{subtitle}</p>
        <div style={{ display: 'flex', gap: 12 , justifyContent: 'center' , paddingTop: 16}}>
          <a className="btn btn-primary" href="#start">{ctaPrimary}</a>
          <a className="btn btn-outline" href="#demo">{ctaSecondary}</a>
        </div>
      </div>
    </section>
  );
}

