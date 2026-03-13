export type QueueStatus = 'waiting' | 'dispensed';

export interface QueueItem {
  id: string;
  queueNumber: string;
  patientName: string;
  patientCode: string;
  doctorName: string;
  timeIn: string;
  status: QueueStatus;
  prescriptionId: string;
}

export interface PrescriptionLot {
  id: string;
  code: string;
  stock: number;
  expiry: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  code: string;
  instruction: string;
  requiredQty: number;
  unit: string;
  usage: Array<{ label: string; tone: 'orange' | 'green' | 'blue' | 'purple' }>;
  lots: PrescriptionLot[];
}

export interface PrescriptionDetail {
  id: string;
  patient: {
    name: string;
    code: string;
    dob: string;
    gender: 'Nam' | 'Nữ';
  };
  doctor: string;
  diagnosis: string;
  createdAt: string;
  note: string;
  items: PrescriptionItem[];
}

export const queueItems: QueueItem[] = [
  {
    id: '1',
    queueNumber: 'A001',
    patientName: 'Nguyễn Thị Lan',
    patientCode: 'BN-2024-001',
    doctorName: 'BS. Trần Văn B',
    timeIn: '08:30',
    status: 'waiting',
    prescriptionId: 'RX-001',
  },
  {
    id: '2',
    queueNumber: 'A002',
    patientName: 'Trần Minh Đức',
    patientCode: 'BN-2024-002',
    doctorName: 'BS. Nguyễn Thị C',
    timeIn: '08:45',
    status: 'waiting',
    prescriptionId: 'RX-002',
  },
  {
    id: '3',
    queueNumber: 'A003',
    patientName: 'Lê Hoàng Nam',
    patientCode: 'BN-2024-003',
    doctorName: 'BS. Trần Văn B',
    timeIn: '09:00',
    status: 'waiting',
    prescriptionId: 'RX-003',
  },
  {
    id: '4',
    queueNumber: 'A004',
    patientName: 'Phạm Thị Hoa',
    patientCode: 'BN-2024-004',
    doctorName: 'BS. Lê Văn D',
    timeIn: '08:15',
    status: 'dispensed',
    prescriptionId: 'RX-004',
  },
  {
    id: '5',
    queueNumber: 'A005',
    patientName: 'Võ Văn Tùng',
    patientCode: 'BN-2024-005',
    doctorName: 'BS. Trần Văn B',
    timeIn: '08:00',
    status: 'dispensed',
    prescriptionId: 'RX-005',
  },
];

const baseItems: PrescriptionItem[] = [
  {
    id: 'med-1',
    name: 'Amoxicillin 500mg',
    code: 'MED-002',
    instruction: 'Uống 3 lần/ngày, mỗi lần 1 viên',
    requiredQty: 21,
    unit: 'Viên',
    usage: [
      { label: 'Sáng: 1', tone: 'orange' },
      { label: 'Trưa: 1', tone: 'green' },
      { label: 'Tối: 1', tone: 'blue' },
    ],
    lots: [
      {
        id: 'lot-1',
        code: 'BATCH-004',
        stock: 300,
        expiry: '2026-04-20',
      },
      {
        id: 'lot-2',
        code: 'BATCH-005',
        stock: 500,
        expiry: '2026-12-30',
      },
    ],
  },
  {
    id: 'med-2',
    name: 'Paracetamol 500mg',
    code: 'MED-001',
    instruction: 'Uống khi sốt trên 38.5°C, cách 4-6 tiếng',
    requiredQty: 10,
    unit: 'Viên',
    usage: [
      { label: 'Khi sốt', tone: 'purple' },
    ],
    lots: [
      {
        id: 'lot-3',
        code: 'BATCH-003',
        stock: 1500,
        expiry: '2027-03-20',
      },
      {
        id: 'lot-4',
        code: 'BATCH-002',
        stock: 800,
        expiry: '2026-09-15',
      },
    ],
  },
  {
    id: 'med-3',
    name: 'Cetirizine 10mg',
    code: 'MED-007',
    instruction: 'Uống 1 lần/ngày buổi tối',
    requiredQty: 7,
    unit: 'Viên',
    usage: [
      { label: 'Tối: 1', tone: 'blue' },
    ],
    lots: [
      {
        id: 'lot-5',
        code: 'BATCH-013',
        stock: 600,
        expiry: '2026-09-20',
      },
      {
        id: 'lot-6',
        code: 'BATCH-015',
        stock: 400,
        expiry: '2027-01-10',
      },
    ],
  },
];

export const prescriptions: PrescriptionDetail[] = [
  {
    id: 'RX-001',
    patient: {
      name: 'Nguyễn Thị Lan',
      code: 'BN-2024-001',
      dob: '15/03/1985',
      gender: 'Nữ',
    },
    doctor: 'BS. Trần Văn B',
    diagnosis: 'Viêm họng cấp',
    createdAt: '08/03/2026 08:15',
    note: 'Uống thuốc sau ăn 30 phút. Tái khám sau 5 ngày nếu không cải thiện.',
    items: baseItems,
  },
  {
    id: 'RX-002',
    patient: {
      name: 'Trần Minh Đức',
      code: 'BN-2024-002',
      dob: '02/11/1991',
      gender: 'Nam',
    },
    doctor: 'BS. Nguyễn Thị C',
    diagnosis: 'Cảm cúm',
    createdAt: '08/03/2026 08:40',
    note: 'Uống đủ liều, nghỉ ngơi và uống nhiều nước.',
    items: baseItems,
  },
  {
    id: 'RX-003',
    patient: {
      name: 'Lê Hoàng Nam',
      code: 'BN-2024-003',
      dob: '21/09/1997',
      gender: 'Nam',
    },
    doctor: 'BS. Trần Văn B',
    diagnosis: 'Viêm họng cấp',
    createdAt: '08/03/2026 09:05',
    note: 'Uống thuốc sau ăn, theo dõi triệu chứng trong 3 ngày.',
    items: baseItems,
  },
  {
    id: 'RX-004',
    patient: {
      name: 'Phạm Thị Hoa',
      code: 'BN-2024-004',
      dob: '10/02/1978',
      gender: 'Nữ',
    },
    doctor: 'BS. Lê Văn D',
    diagnosis: 'Đau họng',
    createdAt: '08/03/2026 08:10',
    note: 'Giữ ấm vùng cổ, uống nước ấm.',
    items: baseItems,
  },
  {
    id: 'RX-005',
    patient: {
      name: 'Võ Văn Tùng',
      code: 'BN-2024-005',
      dob: '28/06/1989',
      gender: 'Nam',
    },
    doctor: 'BS. Trần Văn B',
    diagnosis: 'Cảm cúm',
    createdAt: '08/03/2026 08:00',
    note: 'Uống đủ liều và tái khám nếu sốt kéo dài.',
    items: baseItems,
  },
];
