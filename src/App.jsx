import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";

function App() {
  const arrowDots = [
    { x: 50, y: 52, r: 3 },
    { x: 60, y: 52, r: 3 },
    { x: 70, y: 52, r: 3 },
    { x: 50, y: 66, r: 3 },
    { x: 60, y: 66, r: 3 },
    { x: 70, y: 66, r: 3 },
    { x: 50, y: 80, r: 3 },
    { x: 60, y: 80, r: 3 },
    { x: 70, y: 80, r: 3 },
    { x: 40, y: 94, r: 3 },
    { x: 50, y: 94, r: 3 },
    { x: 60, y: 94, r: 3 },
    { x: 70, y: 94, r: 3 },
    { x: 80, y: 94, r: 3 },
    { x: 50, y: 108, r: 3 },
    { x: 60, y: 108, r: 3 },
    { x: 70, y: 108, r: 3 },
    { x: 60, y: 120, r: 3 },
  ];

  return (
    <Background>
      <main className="relative px-4">
        <SiteNav />

        <section
          id="accueil"
          className="relative h-screen flex items-center justify-center scroll-mt-16"
        >
          <HomeHero arrowDots={arrowDots} />
        </section>

        <ContentSection
          id="projets"
          title="Projets"
          subtitle="Sélection de travaux et collaborations"
        >
          Quelques morceaux, clips et projets à mettre en avant.
        </ContentSection>

        <ContentSection
          id="apropos"
          title="À propos"
          subtitle="Compositeur et univers personnel"
        >
          Musique originale, images sonores et identité simple.
        </ContentSection>

        <ContentSection
          id="contact"
          title="Contact"
          subtitle="On travaille ensemble ?"
        >
          Écris-moi pour une collaboration, une écoute ou un devis.
        </ContentSection>

        <SocialFooter />
      </main>
    </Background>
  );
}

export default App;
