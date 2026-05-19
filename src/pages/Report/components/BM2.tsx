import { Table, Tag } from "antd";

const mockData = [
    { key: 1, stt: 1, thuoc: "Paracetamol", donVi: "Viên", soLuong: 10, cachDung: "2 lần/ngày" },
    { key: 2, stt: 2, thuoc: "Amoxicillin", donVi: "Viên", soLuong: 14, cachDung: "3 lần/ngày" },
];

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Thuốc", dataIndex: "thuoc" },
    { title: "Đơn Vị", dataIndex: "donVi", width: 100, align: "center" as const },
    { title: "Số Lượng", dataIndex: "soLuong", width: 110, align: "center" as const },
    { title: "Cách Dùng", dataIndex: "cachDung" },
];

const patientInfo = {
    hoTen: "Nguyễn Văn An",
    ngayKham: "19/05/2026",
    trieuChung: "Sốt, đau đầu",
    duDoanLoaiBenhh: "Cảm cúm",
};

const BM2 = () => (
    <div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center gap-3">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM2</span>
            <h2 className="text-white font-bold text-lg">Phiếu Khám Bệnh</h2>
        </div>
        <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="flex gap-2 px-6 py-3 border-r border-gray-100">
                <span className="text-xs text-gray-500 w-28">Họ tên:</span>
                <span className="font-semibold text-gray-800">{patientInfo.hoTen}</span>
            </div>
            <div className="flex gap-2 px-6 py-3">
                <span className="text-xs text-gray-500 w-28">Ngày khám:</span>
                <span className="font-semibold text-gray-800">{patientInfo.ngayKham}</span>
            </div>
            <div className="flex gap-2 px-6 py-3 border-r border-t border-gray-100">
                <span className="text-xs text-gray-500 w-28">Triệu chứng:</span>
                <span className="font-semibold text-gray-800">{patientInfo.trieuChung}</span>
            </div>
            <div className="flex gap-2 px-6 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 w-28">Dự đoán loại bệnh:</span>
                <Tag color="orange">{patientInfo.duDoanLoaiBenhh}</Tag>
            </div>
        </div>
        <Table columns={columns} dataSource={mockData} pagination={false} bordered size="middle"
            rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")} />
    </div>
);

export default BM2;
