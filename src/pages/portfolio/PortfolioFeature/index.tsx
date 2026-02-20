import './index.css';

const galleryImages = [
  '/images/gallery-1.jpeg',
  '/images/gallery-2.jpeg',
  '/images/gallery-3.jpeg',
];
function PortfolioFeature() {
  return (
    <div className="align_page_content">
      <div className="gallery gap-4 justify-center grid ">
        {galleryImages.map((src, index) => (
          <div
            key={`gallery-${index + 1}`}
            className={`gallery-item gallery-${
              index + 1
            } w-full h-full overflow-hidden rounded-lg`}
          >
            <img
              src={src}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default PortfolioFeature;
