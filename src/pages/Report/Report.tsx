import { useState } from "react";
import { Button } from "antd";
import { PrinterOutlined, FileTextOutlined } from "@ant-design/icons";
import BM1 from "./components/BM1";
import BM2 from "./components/BM2";
import BM3 from "./components/BM3";
import BM4 from "./components/BM4";
import BM5_1 from "./components/BM5_1";
import BM5_2 from "./components/BM5_2";

const TABS = [
    { key: "bm1", label: "BM1", title: "Danh Sách Khám Bệnh", color: "bg-indigo-500" },
    { key: "bm2", label: "BM2", title: "Phiếu Khám Bệnh", color: "bg-green-500" },
    { key: "bm3", label: "BM3", title: "Danh Sách Bệnh Nhân", color: "bg-purple-500" },
    { key: "bm4", label: "BM4", title: "Hóa Đơn Thanh Toán", color: "bg-orange-500" },
    { key: "bm5_1", label: "BM5.1", title: "Báo Cáo Doanh Thu", color: "bg-teal-500" },
    { key: "bm5_2", label: "BM5.2", title: "Báo Cáo Sử Dụng Thuốc", color: "bg-rose-500" },
];

const COMPONENTS: Record<string, JSX.Element> = {
    bm1: <BM1 />,
    bm2: <BM2 />,
    bm3: <BM3 />,
    bm4: <BM4 />,
    bm5_1: <BM5_1 />,
    bm5_2: <BM5_2 />,
};

const Report = () => {
    const [activeTab, setActiveTab] = useState("bm1");

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-white text-2xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-wide">Quản Lý Biểu Mẫu</h1>
                            <p className="text-blue-200 text-sm">Hệ thống quản lý biểu mẫu phòng khám</p>
                        </div>
                    </div>
                    <Button
                        icon={<PrinterOutlined />}
                        onClick={() => window.print()}
                        className="bg-white text-blue-700 border-0 font-semibold hover:bg-blue-50"
                    >
                        In biểu mẫu
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border ${
                                activeTab === tab.key
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                        >
                            {tab.label}
                            <span className={`ml-2 text-xs font-normal hidden sm:inline ${activeTab === tab.key ? "text-indigo-200" : "text-gray-400"}`}>
                                {tab.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active Component */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {COMPONENTS[activeTab]}
                </div>

                {/* Footer stats */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Tổng bệnh nhân hôm nay", value: "38", color: "bg-blue-500" },
                        { label: "Đã khám", value: "31", color: "bg-green-500" },
                        { label: "Đang chờ", value: "7", color: "bg-yellow-500" },
                        { label: "Doanh thu hôm nay", value: "3.09M", color: "bg-indigo-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center text-white font-bold text-sm`}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Report;