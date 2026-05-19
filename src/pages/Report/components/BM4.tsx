const mockInvoices = [
    { id: 1, hoTen: "Nguyễn Văn An", ngayKham: "19/05/2026", tienKham: 30000, tienThuoc: 85000 },
    { id: 2, hoTen: "Trần Thị Bình", ngayKham: "19/05/2026", tienKham: 30000, tienThuoc: 0 },
];

const BM4 = () => (
    <div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center gap-3">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM4</span>
            <h2 className="text-white font-bold text-lg">Hóa Đơn Thanh Toán</h2>
        </div>
        <div className="p-6 space-y-4">
            {mockInvoices.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full">HÓA ĐƠN #{item.id}</span>
                        <span className="text-xs text-gray-500">{item.ngayKham}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
                            <p className="font-semibold text-gray-800">{item.hoTen}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Ngày khám</p>
                            <p className="font-semibold text-gray-800">{item.ngayKham}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tiền khám</p>
                            <p className="font-semibold text-green-600">{item.tienKham.toLocaleString("vi-VN")} VNĐ</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tiền thuốc</p>
                            <p className="font-semibold text-orange-500">{item.tienThuoc.toLocaleString("vi-VN")} VNĐ</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-indigo-200 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Tổng cộng</span>
                        <span className="text-lg font-bold text-indigo-700">
                            {(item.tienKham + item.tienThuoc).toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default BM4;
