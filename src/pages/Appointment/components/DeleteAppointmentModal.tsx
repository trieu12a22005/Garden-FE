import type { AppointmentItem } from '@/apis/appointment';

interface DeleteAppointmentModalProps {
  open: boolean;
  appointment: AppointmentItem | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const getPatientName = (appointment: AppointmentItem | null) => {
  if (!appointment) {
    return '';
  }

  const firstName = appointment.patient?.account?.firstName?.trim() ?? '';
  const lastName = appointment.patient?.account?.lastName?.trim() ?? '';
  return [firstName, lastName].filter(Boolean).join(' ').trim();
};

const DeleteAppointmentModal = ({
  open,
  appointment,
  isPending,
  onClose,
  onConfirm,
}: DeleteAppointmentModalProps) => {
  if (!open || !appointment) {
    return null;
  }

  const appointmentLabel =
    appointment.appointmentDisplayID ?? appointment.appointmentID;
  const patientName = getPatientName(appointment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Xác nhận xóa lịch hẹn
        </h3>

        <p className="mb-2 text-sm text-gray-600">
          Bạn có chắc chắn muốn xóa lịch hẹn{' '}
          <span className="font-semibold text-gray-800">{appointmentLabel}</span>
          {patientName ? (
            <>
              {' '}
              của bệnh nhân{' '}
              <span className="font-semibold text-gray-800">{patientName}</span>
            </>
          ) : null}
          ?
        </p>

        <p className="mb-5 text-sm text-rose-600">
          Hành động này không thể hoàn tác.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Đang xóa...
              </>
            ) : (
              'Xác nhận xóa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAppointmentModal;
