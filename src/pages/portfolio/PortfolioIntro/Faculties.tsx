import Icon, {
  MedicineBoxOutlined,
  HeartOutlined,
  SmileOutlined,
  UserOutlined,
  SkinOutlined,
  EyeOutlined,
  AudioOutlined,
  WomanOutlined,
  RestOutlined,
} from '@ant-design/icons';

const FacultiesData = [
  { name: 'Nội khoa tổng quát', icon: MedicineBoxOutlined },
  { name: 'Tim mạch', icon: HeartOutlined },
  { name: 'Nhi khoa', icon: SmileOutlined },
  { name: 'Chấn thương chỉnh hình', icon: UserOutlined },
  { name: 'Da liễu', icon: SkinOutlined },
  { name: 'Nhãn khoa', icon: EyeOutlined },
  { name: 'Tai Mũi Họng', icon: AudioOutlined },
  { name: 'Sản phụ khoa', icon: WomanOutlined },
  { name: 'Tâm thần', icon: RestOutlined },
];

function Faculties() {
  return (
    <>
      <div className="grid w-full max-w-[1200px] h-auto grid-cols-3 gap-4 ">
        {FacultiesData.map((faculty, index) => (
          <div
            key={`faculty-${index + 1}`}
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md text-md lg:text-xl text-2xl text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-300"
          >
            <Icon component={faculty.icon} className="" />
            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
              {faculty.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
export default Faculties;
