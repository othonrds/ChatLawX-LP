import { headers } from 'next/headers';
import { deriveLocaleFromHost } from '@/_lib/i18n/locale';
import { getDictionary } from '@/_lib/i18n/dictionary';
import dynamic from 'next/dynamic';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import StatsBar from './_components/StatsBar';
import WhyChoose from './_components/WhyChoose';
import ToolsGrid from './_components/ToolsGrid';
import ComparisonTable from './_components/ComparisonTable';
const Testimonials = dynamic(() => import('./_components/Testimonials'));
const FAQ = dynamic(() => import('./_components/FAQ'));
const Footer = dynamic(() => import('./_components/Footer'));

export default async function HomePage() {
  const now = new Date().toISOString();
  const host = headers().get('host');
  const locale = deriveLocaleFromHost(host);
  const dict = await getDictionary(locale);
  return (
    <>
      <Header brand={dict.header.brand} nav={dict.header.nav} />
      <HeroSection title={dict.hero.title} subtitle={dict.hero.subtitle} ctaPrimary={dict.hero.ctaPrimary} ctaSecondary={dict.hero.ctaSecondary} />
      <WhyChoose title={dict.whyChoose.title} subtitle={dict.whyChoose.subtitle} items={dict.whyChoose.items as any} />
      <ToolsGrid title={dict.tools.title} items={dict.tools.items as any} />
      <ComparisonTable title={dict.compare.title} columns={dict.compare.columns as any} rows={dict.compare.rows as any} />
      <Testimonials title={dict.testimonials.title} items={dict.testimonials.items as any} />
      <FAQ title={dict.faq.title} items={dict.faq.items as any} />
      <Footer product={dict.footer.product} legal={dict.footer.legal} social={dict.footer.social} links={dict.footer.links as any} />
    </>
  );
}