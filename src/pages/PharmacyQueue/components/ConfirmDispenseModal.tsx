import type { ConfirmationItem } from './types';

interface ConfirmDispenseModalProps {
  open: boolean;
  patientName: string;
  confirmationItems: ConfirmationItem[];
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDispenseModal = ({
  open,
  patientName,
  confirmationItems,
  onClose,
  onConfirm,
}: ConfirmDispenseModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Xác nhận phát thuốc</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Bạn có chắc chắn đã soạn đủ thuốc và sẵn sàng phát cho bệnh nhân
          <span className="font-semibold text-gray-800"> {patientName}</span>?
        </p>

        <div className="mt-4 space-y-3">
          {confirmationItems.map((entry) => (
            <div key={entry.item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{entry.item.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    {entry.lots.map((lot) => (
                      <span
                        key={`${entry.item.id}-${lot.code}`}
                        className="rounded-full bg-white px-2 py-1 text-gray-600"
                      >
                        {lot.code}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {entry.lots.reduce((sum, lot) => sum + lot.qty, 0)} {entry.item.unit}
                </span>
              </div>
            </div>
          ))}
          {confirmationItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              Chưa có thuốc nào được chọn.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#1867c0] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Xác nhận phát thuốc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDispenseModal;
