import CTAButton from './CTAButton';
import {
  CalendarOutlined,
  DollarOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
const heroBg = '/clinic-bg.jpeg';
const quickCTAList = [
  {
    text: 'Đặt lịch hẹn',
    link: '/new-appointment',
    icon: PlusOutlined,
    bg: 'bg-blue-700',
    bgHover: 'hover:bg-blue-800',
  },
  {
    text: 'Xem lịch khám bệnh',
    link: '/schedule',
    icon: CalendarOutlined,
    bg: 'bg-red-700',
    bgHover: 'hover:bg-red-800',
  },
  {
    text: 'Tra cứu thông tin',
    link: '/search',
    icon: SearchOutlined,
    bg: 'bg-amber-700',
    bgHover: 'hover:bg-amber-800',
  },
  {
    text: 'Bảng giá dịch vụ',
    link: '/pricing',
    icon: DollarOutlined,
    bg: 'bg-green-700',
    bgHover: 'hover:bg-green-800',
  },
];
function PortfolioHero() {
  return (
    <section className="portfolio__hero">
      <div className="hero w-full h-[calc(100vh-64px)] max-h-[650px]  relative">
        <div className="hero-bg w-full h-[calc(100%-120px)] ">
          <img
            className="hero-bg__img w-full h-full object-cover"
            src={heroBg}
          ></img>
        </div>
        <a
          href="tel:+84123456789"
          className="hotline absolute top-0 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm  md:text-xl font-medium px-8 py-2 rounded-bl-lg rounded-br-lg shadow-lg"
        >
          <span className="animation__popinout inline-block">
            Gọi ngay 📞 123-456-789
          </span>
        </a>
        <div className="quick-cta w-full min-h-[200px] h-auto absolute bottom-[60px] px-[30px] max-w-[1200px] left-1/2 -translate-x-1/2">
          <div className="quick-cta__inner bg-white rounded-xl w-full h-full shadow-2xl  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center overflow-hidden auto-rows-[125px] md:auto-rows-[175px] xl:auto-rows-[200px]">
            {quickCTAList.map((cta) => (
              <CTAButton key={cta.text} {...cta} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default PortfolioHero;
