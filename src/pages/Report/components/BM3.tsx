import { Table } from "antd";

const mockData = [
    { key: 1, stt: 1, hoTen: "Nguyễn Văn An", ngayKham: "19/05/2026", loaiBenhh: "Cảm cúm", trieuChung: "Sốt, ho" },
    { key: 2, stt: 2, hoTen: "Trần Thị Bình", ngayKham: "19/05/2026", loaiBenhh: "Tiêu chảy", trieuChung: "Đau bụng" },
    { key: 3, stt: 3, hoTen: "Phạm Thị Dung", ngayKham: "18/05/2026", loaiBenhh: "Huyết áp", trieuChung: "Chóng mặt" },
];

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Họ Tên", dataIndex: "hoTen" },
    { title: "Ngày Khám", dataIndex: "ngayKham", width: 130, align: "center" as const },
    { title: "Loại Bệnh", dataIndex: "loaiBenhh" },
    { title: "Triệu Chứng", dataIndex: "trieuChung" },
];

const BM3 = () => (
    <div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center gap-3">
            <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM3</span>
            <h2 className="text-white font-bold text-lg">Danh Sách Bệnh Nhân</h2>
        </div>
        <Table columns={columns} dataSource={mockData} pagination={false} bordered size="middle"
            rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")} />
    </div>
);

export default BM3;
