interface DoctorNoteCardProps {
  note: string;
}

const DoctorNoteCard = ({ note }: DoctorNoteCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">Ghi chú của bác sĩ</h3>
      <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">{note}</div>
    </div>
  );
};

export default DoctorNoteCard;
