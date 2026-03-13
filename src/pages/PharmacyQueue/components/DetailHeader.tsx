interface DetailHeaderProps {
  prescriptionId: string;
  onBack: () => void;
}

const DetailHeader = ({ prescriptionId, onBack }: DetailHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đơn thuốc {prescriptionId}</h1>
        <p className="text-sm text-gray-500">Chọn lô thuốc để bóc theo đơn</p>
      </div>
    </div>
  );
};

export default DetailHeader;
