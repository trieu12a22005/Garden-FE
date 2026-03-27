import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QueueStatus } from './data';
import type { MedicineTicket } from '@/apis/medicine';
import medicineApi from '@/apis/medicine';
import CurrentQueueCard from './components/CurrentQueueCard';
import QueueSummary from './components/QueueSummary';
import QueueTable from './components/QueueTable';
import { useQuery } from '@tanstack/react-query';

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapTicketStatus = (status?: string): QueueStatus => {
  const normalized = status?.toLowerCase() ?? '';
  if (['dispensed', 'done', 'completed', 'complete', 'issued'].includes(normalized)) {
    return 'dispensed';
  }
  return 'waiting';
};

const formatQueueNumber = (orderNum?: number | string) => {
  if (typeof orderNum === 'number') {
    return String(orderNum).padStart(3, '0');
  }
  if (typeof orderNum === 'string' && orderNum.length > 0) {
    return orderNum;
  }
  return '--';
};

const PharmacyQueue = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | QueueStatus>('all');
  const today = useMemo(() => formatDateInput(new Date()), []);

  const { data } = useQuery({
    queryKey: ['medicine-tickets', today],
    queryFn: () => medicineApi.getMedicineTickets({ date: today }),
  });

  const queueItems = useMemo(() => {
    const tickets = data?.data ?? [];
    return tickets.map((ticket: MedicineTicket) => ({
      id: ticket.ticketID,
      queueNumber: formatQueueNumber(ticket.orderNum),
      patientName: 'Chưa có',
      patientCode: '--',
      doctorName: '--',
      timeIn: '--',
      status: mapTicketStatus(ticket.status),
      prescriptionId: ticket.prescriptionID,
    }));
  }, [data]);

  const waitingCount = queueItems.filter((item) => item.status === 'waiting').length;
  const dispensedCount = queueItems.filter((item) => item.status === 'dispensed').length;
  const totalCount = queueItems.length;
  const currentItem = queueItems.find((item) => item.status === 'waiting') ?? queueItems[0];

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return queueItems.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.patientName.toLowerCase().includes(normalizedSearch) ||
        item.patientCode.toLowerCase().includes(normalizedSearch) ||
        item.queueNumber.toLowerCase().includes(normalizedSearch) ||
        item.prescriptionId.toLowerCase().includes(normalizedSearch) ||
        item.id.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [queueItems, search, statusFilter]);

  const handleViewPrescription = (prescriptionId: string) => {
    navigate(`/pharmacy-queue/${prescriptionId}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Hàng đợi phát thuốc</h1>
          <p className="text-sm text-gray-500">Quản lý và gọi số bệnh nhân nhận thuốc</p>
        </div>

        <QueueSummary
          waitingCount={waitingCount}
          dispensedCount={dispensedCount}
          totalCount={totalCount}
        />

        {currentItem && (
          <CurrentQueueCard
            currentItem={currentItem}
            onViewPrescription={handleViewPrescription}
          />
        )}

        <QueueTable
          items={filteredItems}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewPrescription={handleViewPrescription}
        />
      </div>
    </div>
  );
};

export default PharmacyQueue;
