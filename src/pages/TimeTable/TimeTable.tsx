import { useState } from 'react';


export interface WeekDay {
    key: string;
    label: string;
    date: string;
}

export interface ScheduleDetail {
    title: string;
    maxPatients: number;
    doctor: string;
    colorClass: string;
    containerHoverClass: string; 
}

export interface RoomData {
    id: string;
    name: string;
    faculty: string; 
    schedules: Record<string, ScheduleDetail>;
}
export default function RoomSchedule() {
    const [activeTab, setActiveTab] = useState<string>('CÁ NHÂN');
    const [activeFaculty, setActiveFaculty] = useState<string>('KHU A');

    const facultys: string[] = ['KHU A', 'KHU B', 'KHU C', 'PHÒNG MỔ', 'XÉT NGHIỆM'];
    const tabs: string[] = ['CÁ NHÂN', 'TOÀN BỆNH VIỆN'];
    const weekDays: WeekDay[] = [
        { key: 't2', label: 'Thứ 2', date: '02-03-2026' },
        { key: 't3', label: 'Thứ 3', date: '03-03-2026' },
        { key: 't4', label: 'Thứ 4', date: '04-03-2026' },
        { key: 't5', label: 'Thứ 5', date: '05-03-2026' },
        { key: 't6', label: 'Thứ 6', date: '06-03-2026' },
        { key: 't7', label: 'Thứ 7', date: '07-03-2026' },
        { key: 'cn', label: 'Chủ nhật', date: '08-03-2026' },
    ];
    const roomsData: RoomData[] = [
        {
            id: 'room_1',
            name: 'P.Nội 1',
            faculty: 'kHOA A',
            schedules: {
                t2: {
                    title: 'Khám Nội Tổng Quát',
                    maxPatients: 40,
                    doctor: 'BS: Long Triều',
                    colorClass: 'text-[#1867c0]',
                    containerHoverClass: 'hover:bg-blue-50'
                },
                t4: {
                    title: 'Khám Nội Tổng Quát',
                    maxPatients: 40,
                    doctor: 'BS: Long Triều',
                    colorClass: 'text-[#1867c0]',
                    containerHoverClass: 'hover:bg-blue-50'
                }
            }
        },
        {
            id: 'room_2',
            name: 'P.Nội 2',
            faculty: 'kHOA A',
            schedules: {
                t3: {
                    title: 'Khám Tim Mạch',
                    maxPatients: 30,
                    doctor: 'BS: Văn Đức Sơn Hà',
                    colorClass: 'text-[#d48806]', 
                    containerHoverClass: 'hover:bg-yellow-50'
                },
                t5: {
                    title: 'Khám Tim Mạch',
                    maxPatients: 30,
                    doctor: 'BS: Văn Đức Sơn Hà',
                    colorClass: 'text-[#d48806]',
                    containerHoverClass: 'hover:bg-yellow-50'
                }
            }
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="mx-auto max-w-[1400px] bg-white p-6 rounded-lg shadow-sm border border-gray-200">

                {/* TIÊU ĐỀ VÀ ĐIỀU HƯỚNG */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#1867c0] mb-2 uppercase">Lịch Trực Và Công Tác</h1>
                    <div className="text-[#1867c0] text-sm font-medium flex justify-center items-center gap-2">
                        <button className="hover:underline">&lt;&lt; Tuần trước đó</button>
                        <span className="text-gray-400">|</span>
                        <button className="hover:underline font-bold text-gray-800">Tuần hiện tại</button>
                        <span className="text-gray-400">|</span>
                        <button className="hover:underline">Tuần kế tiếp &gt;&gt;</button>
                    </div>
                </div>

                {/* CÁC NÚT TAB KHU VỰC */}
                {activeTab === 'CÁ NHÂN' ? (
                    <div className="h-[40px] mb-8"></div>
                ) : (
                    <div className="flex justify-center mb-8 flex-wrap gap-1">
                        {facultys.map((faculty) => (
                            <button
                                key={faculty}
                                onClick={() => setActiveFaculty(faculty)}
                                className={`px-6 py-2 text-sm font-semibold cursor-pointer rounded transition-colors ${activeFaculty === faculty
                                        ? 'bg-[#E6E6FA] text-black border border-[#6495ED]'
                                        : 'bg-[#6495ED] text-white hover:bg-blue-600'
                                    }`}
                            >
                                {faculty}
                            </button>
                        ))}
                    </div>
                )}

                {/* CÁC NÚT TAB CHÍNH */}
                <div className="flex justify-center mb-8 flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2.5 cursor-pointer text-sm font-bold rounded transition-colors ${activeTab === tab
                                    ? 'bg-[#E6E6FA] text-black border border-[#6495ED]'
                                    : 'bg-[#6495ED] text-white hover:bg-blue-600'
                                }`}
                        >
                            LỊCH {tab}
                        </button>
                    ))}
                </div>

                {/* TIÊU ĐỀ KHU VỰC ĐANG CHỌN */}
                <h2 className="text-xl font-bold text-red-600 text-center mb-4 uppercase">
                    {activeTab === 'CÁ NHÂN' ? 'LỊCH TRỰC CỦA TÔI' : 'LỊCH TRỰC TOÀN BỆNH VIỆN'}
                </h2>

                {/* BẢNG LỊCH (TABLE) */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] border-collapse border border-gray-300 text-sm text-center">

                        {/* DÒNG TIÊU ĐỀ (NGÀY TRONG TUẦN) */}
                        <thead>
                            <tr className="bg-gray-50 text-gray-800">
                                {/* Đã xóa cột "Ca trực" */}
                                <th className="border border-gray-300 p-2 w-[120px]">Phòng khám</th>
                                {weekDays.map((day) => (
                                    <th key={day.key} className="border border-gray-300 p-2 w-[12%]">
                                        {day.label}<br />
                                        <span className="font-normal text-xs">({day.date})</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* NỘI DUNG BẢNG */}
                        <tbody>
                            {/* Lặp qua mảng Phòng Khám (mỗi phòng 1 dòng) */}
                            {roomsData.map((room) => (
                                <tr key={room.id} className="h-[200px]">

                                    {/* Cột Tên Phòng (Không cần rowSpan nữa) */}
                                    <td className="border border-gray-300 font-bold p-2 align-middle">
                                        <div className="text-lg">{room.name}</div>
                                        <div className="text-xs font-normal mt-2 text-gray-500">{room.faculty}</div>
                                    </td>

                                    {/* Lặp qua 7 ngày để in nội dung ca làm việc */}
                                    {weekDays.map((day) => {
                                        const schedule = room.schedules[day.key];

                                        // Nếu ngày đó CÓ lịch của phòng này
                                        if (schedule) {
                                            return (
                                                <td key={day.key} className={`border border-gray-300 p-3 align-top text-left transition-colors cursor-pointer ${schedule.containerHoverClass}`}>
                                                    <div className={`font-bold text-left mt-[20px] ${schedule.colorClass}`}>
                                                        {schedule.title}
                                                    </div>
                                                    <div className="text-xs text-left mb-1">
                                                        Bệnh nhân tối đa: {schedule.maxPatients}
                                                    </div>
                                                    <hr className="my-1 border-gray-300" />
                                                    <div className="text-xs">
                                                        <p className="font-bold text-left font-semibold mt-[10px]">
                                                            {schedule.doctor}
                                                        </p>
                                                    </div>
                                                </td>
                                            );
                                        }
                                        return <td key={day.key} className="border border-gray-300 p-3"></td>;
                                    })}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}