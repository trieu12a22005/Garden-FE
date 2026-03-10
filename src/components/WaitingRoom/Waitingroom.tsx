import  { useState } from 'react';
export interface Patient {
    id: string;
    queueNumber: number; // Số thứ tự
    name: string;
    age: number;
    gender: 'Nam' | 'Nữ';
    reason: string; // Lý do khám
    status: 'waiting' | 'examining' | 'skipped';
    phone: string;
    history: string;
}
export default function WaitingRoom() {
    const [patients] = useState<Patient[]>([
        {
            id: 'BN001',
            queueNumber: 1,
            name: 'Nguyễn Văn An',
            age: 45,
            gender: 'Nam',
            reason: 'Đau tức ngực kéo dài, khó thở',
            status: 'waiting',
            phone: '0901234567',
            history: 'Tiền sử cao huyết áp, đang dùng thuốc Amlodipine 5mg.'
        },
        {
            id: 'BN002',
            queueNumber: 2,
            name: 'Trần Thị Bích',
            age: 32,
            gender: 'Nữ',
            reason: 'Đau dạ dày, buồn nôn sau khi ăn',
            status: 'waiting',
            phone: '0912345678',
            history: 'Từng nội soi dạ dày năm 2024, viêm hang vị.'
        },
        {
            id: 'BN003',
            queueNumber: 3,
            name: 'Lê Hoàng Hải',
            age: 28,
            gender: 'Nam',
            reason: 'Sốt cao liên tục 2 ngày, đau nhức mình',
            status: 'waiting',
            phone: '0987654321',
            history: 'Không có tiền sử bệnh nền.'
        },
        {
            id: 'BN004',
            queueNumber: 4,
            name: 'Phạm Thu Thảo',
            age: 50,
            gender: 'Nữ',
            reason: 'Khám sức khỏe định kỳ',
            status: 'waiting',
            phone: '0909999888',
            history: 'Gia đình có người tiểu đường.'
        }
    ]);
    const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0].id);
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="mx-auto max-w-[1400px]">
                
                {/* Header trang */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1867c0] uppercase">Phòng Khám Nội 1</h1>
                        <p className="text-gray-600">Bác sĩ phụ trách: Huỳnh Phạm Long Triều</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-sm">
                        Đang chờ: {patients.length} bệnh nhân
                    </div>
                </div>

                {/* BỐ CỤC CHÍNH 2 CỘT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* ================= CỘT TRÁI: DANH SÁCH HÀNG ĐỢI (Tương ứng khối bên trái trong hình) ================= */}
                    <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-140px)] overflow-hidden">
                        
                        {/* Tiêu đề khối bên trái */}
                        <div className="bg-[#1867c0] text-white p-4">
                            <h2 className="text-lg font-bold">Danh sách chờ khám</h2>
                        </div>

                        {/* Danh sách bệnh nhân (Có thanh cuộn) */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                            {patients.map((patient) => {
                                const isSelected = patient.id === selectedPatientId;
                                return (
                                    <div
                                        key={patient.id}
                                        onClick={() => setSelectedPatientId(patient.id)}
                                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all border ${
                                            isSelected 
                                                // Style khi được chọn (Mô phỏng màu cam/xanh đậm trong hình)
                                                ? 'bg-blue-50 border-[#1867c0] shadow-md transform scale-[1.02]' 
                                                // Style mặc định
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                        }`}
                                    >
                                        {/* Avatar / Khối tròn chứa Số Thứ Tự */}
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg flex-shrink-0 ${
                                            isSelected ? 'bg-[#ff9800] text-white' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {patient.queueNumber}
                                        </div>

                                        {/* Thông tin vắn tắt (Khối chữ nhật trong hình) */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold truncate ${isSelected ? 'text-[#1867c0]' : 'text-gray-800'}`}>
                                                {patient.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {patient.age} tuổi - {patient.gender}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ================= CỘT PHẢI: CHI TIẾT BỆNH NHÂN & ACTION (Tương ứng khối bên phải trong hình) ================= */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* Khối Thông tin chi tiết */}
                        {selectedPatient && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                                
                                {/* Tiêu đề khối bên phải */}
                                <div className="bg-[#1867c0] text-white p-4">
                                    <h2 className="text-lg font-bold">Hồ sơ bệnh nhân</h2>
                                </div>

                                <div className="p-6">
                                    {/* Header của thẻ chi tiết (Avatar to + Tên) */}
                                    <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                                        <div className="w-20 h-20 bg-blue-100 text-[#1867c0] rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                                            {selectedPatient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h2>
                                            <div className="flex gap-4 text-gray-600 mt-1">
                                                <span><span className="font-semibold">Mã BN:</span> {selectedPatient.id}</span>
                                                <span>•</span>
                                                <span><span className="font-semibold">Tuổi:</span> {selectedPatient.age}</span>
                                                <span>•</span>
                                                <span><span className="font-semibold">Giới tính:</span> {selectedPatient.gender}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Khối chữ nhật to chứa Nội dung chi tiết (Màu xanh to trong hình) */}
                                    <div className="space-y-6">
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                            <h3 className="text-sm font-bold text-red-800 uppercase mb-2">Lý do khám bệnh (Lâm sàng)</h3>
                                            <p className="text-gray-800 text-lg font-medium">{selectedPatient.reason}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Thông tin liên hệ</h3>
                                                <p className="text-gray-800">{selectedPatient.phone}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Dấu hiệu sinh tồn (ĐD Đo)</h3>
                                                <p className="text-gray-800">HA: 120/80 - Mạch: 75 - Nhiệt: 37°C</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h3 className="text-sm font-bold text-[#1867c0] uppercase mb-2">Tiền sử bệnh án</h3>
                                            <p className="text-gray-800">{selectedPatient.history}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= Khối Nút chức năng (2 nút dưới cùng trong hình) ================= */}
                        <div className="flex justify-end gap-4">
                            <button className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors shadow-sm">
                                Bỏ qua ca này
                            </button>
                            <button className="px-8 py-3 bg-[#1867c0] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                TIẾN HÀNH KHÁM
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}