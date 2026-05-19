import { useState } from "react";
import { DatePicker, Table } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";

const { MonthPicker } = DatePicker;

const mockData = [
    { key: 1, stt: 1, thuoc: "Paracetamol", donViTinh: "Viên", soLuong: 450, soLanDung: 120 },
    { key: 2, stt: 2, thuoc: "Amoxicillin", donViTinh: "Viên", soLuong: 280, soLanDung: 85 },
    { key: 3, stt: 3, thuoc: "Vitamin C", donViTinh: "Viên", soLuong: 600, soLanDung: 200 },
];

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Thuốc", dataIndex: "thuoc" },
    { title: "Đơn Vị Tính", dataIndex: "donViTinh", width: 130, align: "center" as const },
    { title: "Số Lượng", dataIndex: "soLuong", width: 120, align: "center" as const },
    { title: "Số Lần Dùng", dataIndex: "soLanDung", width: 130, align: "center" as const },
];

const BM5_2 = () => {
    const [month, setMonth] = useState<Dayjs>(dayjs());

    return (
        <div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM5.2</span>
                    <h2 className="text-white font-bold text-lg">Báo Cáo Sử Dụng Thuốc</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                    <CalendarOutlined className="text-white text-sm" />
                    <span className="text-white text-xs font-medium">Tháng:</span>
                    <MonthPicker value={month} onChange={(v) => v && setMonth(v)} format="MM/YYYY" size="small" style={{ width: 110 }} />
                </div>
            </div>
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-gray-500">
                Báo cáo tháng: <strong className="text-blue-700">{month.format("MM/YYYY")}</strong>
            </div>
            <Table
                columns={columns}
                dataSource={mockData}
                pagination={false}
                bordered
                size="middle"
                rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
            />
        </div>
    );
};

export default BM5_2;
