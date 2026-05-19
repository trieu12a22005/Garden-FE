import { useState } from "react";
import { DatePicker, Table } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";

const { MonthPicker } = DatePicker;

const mockData = [
    { key: 1, stt: 1, ngay: "01/05/2026", soBenhNhan: 35, doanhThu: 1050000, tyLe: "3.2%" },
    { key: 2, stt: 2, ngay: "02/05/2026", soBenhNhan: 40, doanhThu: 1200000, tyLe: "3.7%" },
    { key: 3, stt: 3, ngay: "03/05/2026", soBenhNhan: 28, doanhThu: 840000, tyLe: "2.6%" },
];

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Ngày", dataIndex: "ngay", width: 130, align: "center" as const },
    { title: "Số Bệnh Nhân", dataIndex: "soBenhNhan", width: 150, align: "center" as const },
    {
        title: "Doanh Thu (VNĐ)", dataIndex: "doanhThu", align: "right" as const,
        render: (v: number) => v.toLocaleString("vi-VN"),
    },
    { title: "Tỷ Lệ", dataIndex: "tyLe", width: 90, align: "center" as const },
];

const BM5_1 = () => {
    const [month, setMonth] = useState<Dayjs>(dayjs());

    return (
        <div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM5.1</span>
                    <h2 className="text-white font-bold text-lg">Báo Cáo Doanh Thu Theo Tháng</h2>
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
                summary={(data) => {
                    const total = data.reduce((s, r) => s + r.doanhThu, 0);
                    const totalPt = data.reduce((s, r) => s + r.soBenhNhan, 0);
                    return (
                        <Table.Summary.Row className="font-bold bg-blue-50">
                            <Table.Summary.Cell index={0} colSpan={2} align="center"><strong>Tổng cộng</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="center"><strong className="text-indigo-700">{totalPt}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right"><strong className="text-green-600">{total.toLocaleString("vi-VN")} VNĐ</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={3} />
                        </Table.Summary.Row>
                    );
                }}
            />
        </div>
    );
};

export default BM5_1;
