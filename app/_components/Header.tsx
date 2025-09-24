import Image from "next/image";

type Props = {
  brand: string;
  nav: { features: string; tools: string; pricing: string; login: string };
};

export default function Header({ brand, nav }: Props) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'saturate(180%) blur(8px)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
        <div style={{ fontWeight: 700 }}>
          <Image src="/images/logo.png" alt="LawX" width={130} height={40} />
        </div>
        <nav style={{ display: 'flex', gap: 16 }}>
          <a href="#features" className="btn btn-outline" style={{ padding: '8px 12px' }}>{nav.features}</a>
          <a href="#tools" className="btn btn-outline" style={{ padding: '8px 12px' }}>{nav.tools}</a>
          <a href="#pricing" className="btn btn-outline" style={{ padding: '8px 12px' }}>{nav.pricing}</a>
        </nav>
      </div>
    </header>
  );
}

