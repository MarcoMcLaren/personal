import { PageLayout } from '@/components/templates/PageLayout/PageLayout';
import { Hero } from '@/components/organisms/Hero/Hero';
import { About } from '@/components/organisms/About/About';
import { Experience } from '@/components/organisms/Experience/Experience';
import { Skills } from '@/components/organisms/Skills/Skills';
import { Awards } from '@/components/organisms/Awards/Awards';
import { Contact } from '@/components/organisms/Contact/Contact';

/** The single-page portfolio, composed from organisms in narrative order. */
export function HomePage() {
  return (
    <PageLayout>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Awards />
      <Contact />
    </PageLayout>
  );
}
