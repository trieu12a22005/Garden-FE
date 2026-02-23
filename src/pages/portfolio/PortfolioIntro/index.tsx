import Faculties from './Faculties';

function PortfolioIntro() {
  return (
    <section className="portfolio__intro align_page_content">
      <h2 className="text-3xl font-semibold text-red-800">
        Khám bệnh tại phòng khám
      </h2>
      <p className="text-lg text-gray-700 max-w-2xl text-center">
        Chúng tôi cung cấp dịch vụ khám bệnh chuyên nghiệp với đội ngũ bác sĩ
        giàu kinh nghiệm và cơ sở vật chất hiện đại.
      </p>
      <Faculties />
    </section>
  );
}
export default PortfolioIntro;
