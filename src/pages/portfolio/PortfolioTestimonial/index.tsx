import { Carousel } from 'antd';
const TestimonialRawObject = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    age: '30 tuổi',
    testimonial:
      'Tôi rất hài lòng với dịch vụ chăm sóc sức khỏe tại đây. Đội ngũ bác sĩ chuyên nghiệp, tận tâm và luôn quan tâm đến bệnh nhân.',
    image: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    age: '45 tuổi',
    testimonial:
      'Cơ sở vật chất hiện đại, quy trình khám bệnh nhanh chóng và hiệu quả. Tôi cảm thấy an tâm khi được điều trị tại phòng khám.',
    image: 'https://i.pravatar.cc/150?img=5',
  },
];
function PortfolioTestimonials() {
  return (
    <>
      <section className="mt-10 testimonials ">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Sự tin tưởng của bệnh nhân
        </h2>
        <div className="carousel w-full flex items-center justify-center ">
          <Carousel
            autoplay
            autoplaySpeed={3000}
            className="w-full h-[400px]  max-w-[600px] mx-auto px-4"
          >
            {TestimonialRawObject.map((testimonial) => (
              <div
                key={testimonial.id}
                className="testimonial-item w-full h-full flex flex-col items-center justify-center gap-4"
              >
                <p className="testimonial-text text-center mb-4 text-2xl">
                  {testimonial.testimonial}
                </p>
                <div className="testimonial-header flex flex-col items-center gap-2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="testimonial-image w-24 h-24 rounded-full object-cover !hidden lg:!block"
                  />
                  <h3 className="testimonial-name text-lg font-semibold">
                    {testimonial.name}
                  </h3>
                  <p className="testimonial-age text-sm text-gray-500">
                    {testimonial.age}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    </>
  );
}
export default PortfolioTestimonials;
