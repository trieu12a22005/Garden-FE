import type {
  AppointmentDepositStatus,
  AppointmentItem,
  AppointmentStatus,
  AppointmentType,
} from '@/apis/appointment';

type DisplayStatusFilter = 'all' | AppointmentStatus;

const appointmentTypeLabels: Record<AppointmentType, string> = {
  examine: 'Khám bệnh',
  re_examine: 'Tái khám',
};

const statusStyles: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Chờ duyệt',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  approved: {
    label: 'Đã duyệt',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

const depositStyles: Record<
  AppointmentDepositStatus,
  { label: string; className: string }
> = {
  paid: {
    label: 'Đã thanh toán',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  unpaid: {
    label: 'Chờ thanh toán',
    className: 'border-slate-200 bg-slate-50 text-slate-700',
  },
  refunded: {
    label: 'Đã hoàn tiền',
    className: 'border-violet-200 bg-violet-50 text-violet-700',
  },
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getPatientName = (appointment: AppointmentItem) => {
  const firstName = appointment.patient?.account?.firstName?.trim() ?? '';
  const lastName = appointment.patient?.account?.lastName?.trim() ?? '';
  return [firstName, lastName].filter(Boolean).join(' ') || '--';
};

const getAppointmentTypeLabel = (appointmentType?: AppointmentItem['appointmentType']) => {
  if (!appointmentType) {
    return '--';
  }

  if (appointmentType in appointmentTypeLabels) {
    return appointmentTypeLabels[appointmentType as AppointmentType];
  }

  return String(appointmentType);
};

const getDepositBadge = (depositStatus?: AppointmentDepositStatus) => {
  if (!depositStatus || !(depositStatus in depositStyles)) {
    return {
      label: String(depositStatus ?? '--'),
      className: 'border-slate-200 bg-slate-50 text-slate-700',
    };
  }

  return depositStyles[depositStatus];
};

interface AppointmentTableProps {
  items: AppointmentItem[];
  displayedCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: DisplayStatusFilter;
  onStatusFilterChange: (value: DisplayStatusFilter) => void;
  onDelete: (appointment: AppointmentItem) => void;
  isDeleting: boolean;
}

const AppointmentTable = ({
  items,
  displayedCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onDelete,
  isDeleting,
}: AppointmentTableProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách lịch hẹn</h2>
          <p className="text-sm text-gray-500">
            Đang hiển thị: {displayedCount} lịch hẹn
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm kiếm lịch hẹn..."
              className="w-64 rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as DisplayStatusFilter)
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Tên bệnh nhân</th>
              <th className="px-3 py-3">Loại hẹn</th>
              <th className="px-3 py-3">Phòng</th>
              <th className="px-3 py-3">Khoa</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3">Thanh toán</th>
              <th className="px-3 py-3">Tạo lúc</th>
              <th className="px-3 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-sm text-gray-500">
                  Chưa có lịch hẹn nào phù hợp.
                </td>
              </tr>
            ) : (
              items.map((appointment) => {
                const statusBadge = statusStyles[appointment.status] ?? {
                  label: appointment.status,
                  className: 'border-slate-200 bg-slate-50 text-slate-700',
                };
                const depositBadge = getDepositBadge(appointment.depositStatus);
                const createdAt =
                  typeof appointment.createdAt === 'string'
                    ? appointment.createdAt
                    : appointment.scheduleDate;
                const isDeleteDisabled = appointment.status === 'approved';

                return (
                  <tr key={appointment.appointmentID} className="border-t border-gray-100">
                    <td className="px-3 py-4 font-medium text-blue-600">
                      {appointment.appointmentDisplayID ?? '--'}
                    </td>
                    <td className="px-3 py-4 text-gray-700">{getPatientName(appointment)}</td>
                    <td className="px-3 py-4 text-gray-600">
                      {getAppointmentTypeLabel(appointment.appointmentType)}
                    </td>
                    <td className="px-3 py-4 text-gray-600">
                      {appointment.room?.roomName ?? '--'}
                    </td>
                    <td className="px-3 py-4 text-gray-600">
                      {appointment.faculty?.facultyName ?? '--'}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${depositBadge.className}`}
                      >
                        {depositBadge.label}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-gray-600">{formatDateTime(createdAt)}</td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => onDelete(appointment)}
                          disabled={isDeleting || isDeleteDisabled}
                          title={
                            isDeleteDisabled
                              ? 'Không thể xóa lịch hẹn đã duyệt'
                              : 'Xóa lịch hẹn'
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 7h12M9 7V5h6v2m-7 3v7m4-7v7m4-7v7M7 7l1 12h8l1-12"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
