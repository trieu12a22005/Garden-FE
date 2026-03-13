import type { PrescriptionDetail } from '../data';

interface PrescriptionInfoCardsProps {
  patient: PrescriptionDetail['patient'];
  doctor: string;
  diagnosis: string;
  createdAt: string;
}

const PrescriptionInfoCards = ({ patient, doctor, diagnosis, createdAt }: PrescriptionInfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </span>
          Thông tin bệnh nhân
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-xs text-gray-400">Họ tên</p>
            <p className="font-semibold">{patient.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Mã BN</p>
            <p className="font-semibold">{patient.code}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Ngày sinh</p>
            <p className="font-semibold">{patient.dob}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Giới tính</p>
            <p className="font-semibold">{patient.gender}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 16h6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </span>
          Thông tin đơn thuốc
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-xs text-gray-400">Bác sĩ kê đơn</p>
            <p className="font-semibold">{doctor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Ngày kê đơn</p>
            <p className="font-semibold">{createdAt}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400">Chẩn đoán</p>
            <p className="font-semibold">{diagnosis}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionInfoCards;
