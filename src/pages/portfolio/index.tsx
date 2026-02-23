import PortfolioFeature from './PortfolioFeature';
import PortfolioHero from './PortfolioHero';
import PortfolioIntro from './PortfolioIntro';
import PortfolioTestimonials from './PortfolioTestimonial';
import './index.css';
function Portfolio() {
  return (
    <div className="portfolio w-full h-full ">
      <PortfolioHero />
      <div className="portfolio__content px-6  md:gap-14 xl:gap-20 ">
        <PortfolioIntro />
        <PortfolioFeature />
        <PortfolioTestimonials />
      </div>
    </div>
  );
}
export default Portfolio;
