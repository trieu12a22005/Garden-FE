import { useMemo, useState } from 'react';

type MedicineStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
type InventoryTab = 'all' | 'low-stock' | 'expiring';
type CategoryTone = 'slate' | 'blue' | 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo';

interface LotInfo {
  id: string;
  code: string;
  quantity: number;
  receivedAt: string;
  expiry: string;
  remainingDays: number;
  note?: string;
}

interface MedicineItem {
  id: string;
  name: string;
  code: string;
  manufacturer: string;
  category: string;
  categoryTone: CategoryTone;
  unit: string;
  totalStock: number;
  status: MedicineStatus;
  minStock: number;
  price: number;
  description: string;
  lots: LotInfo[];
}

const medicines: MedicineItem[] = [
  {
    id: 'med-001',
    name: 'Paracetamol 500mg',
    code: 'MED-001',
    manufacturer: 'DHG Pharma',
    category: 'Giảm đau',
    categoryTone: 'slate',
    unit: 'Viên',
    totalStock: 1500,
    status: 'in-stock',
    minStock: 500,
    price: 2000,
    description: 'Thuốc giảm đau, hạ sốt',
    lots: [
      {
        id: 'lot-001',
        code: 'BATCH-003',
        quantity: 200,
        receivedAt: '5/10/2025',
        expiry: '1/4/2026',
        remainingDays: 14,
        note: 'Lô cũ - ưu tiên xuất',
      },
      {
        id: 'lot-002',
        code: 'BATCH-001',
        quantity: 500,
        receivedAt: '10/1/2026',
        expiry: '15/6/2026',
        remainingDays: 89,
      },
      {
        id: 'lot-003',
        code: 'BATCH-002',
        quantity: 800,
        receivedAt: '15/2/2026',
        expiry: '20/3/2027',
        remainingDays: 367,
      },
    ],
  },
  {
    id: 'med-002',
    name: 'Amoxicillin 500mg',
    code: 'MED-002',
    manufacturer: 'Pymepharco',
    category: 'Kháng sinh',
    categoryTone: 'blue',
    unit: 'Viên',
    totalStock: 800,
    status: 'in-stock',
    minStock: 300,
    price: 3500,
    description: 'Kháng sinh phổ rộng',
    lots: [
      {
        id: 'lot-004',
        code: 'BATCH-004',
        quantity: 300,
        receivedAt: '10/1/2026',
        expiry: '20/4/2026',
        remainingDays: 33,
      },
      {
        id: 'lot-005',
        code: 'BATCH-010',
        quantity: 500,
        receivedAt: '12/2/2026',
        expiry: '20/12/2026',
        remainingDays: 277,
      },
    ],
  },
  {
    id: 'med-003',
    name: 'Omeprazole 20mg',
    code: 'MED-003',
    manufacturer: 'Traphaco',
    category: 'Tiêu hóa',
    categoryTone: 'sky',
    unit: 'Viên',
    totalStock: 120,
    status: 'low-stock',
    minStock: 200,
    price: 5000,
    description: 'Giảm tiết acid dạ dày',
    lots: [
      {
        id: 'lot-006',
        code: 'BATCH-006',
        quantity: 50,
        receivedAt: '20/9/2025',
        expiry: '25/3/2026',
        remainingDays: 7,
      },
      {
        id: 'lot-007',
        code: 'BATCH-007',
        quantity: 70,
        receivedAt: '2/11/2025',
        expiry: '10/7/2026',
        remainingDays: 120,
      },
    ],
  },
  {
    id: 'med-004',
    name: 'Vitamin C 1000mg',
    code: 'MED-004',
    manufacturer: 'Mediplantex',
    category: 'Vitamin',
    categoryTone: 'emerald',
    unit: 'Viên',
    totalStock: 2000,
    status: 'in-stock',
    minStock: 600,
    price: 1500,
    description: 'Tăng sức đề kháng',
    lots: [
      {
        id: 'lot-008',
        code: 'BATCH-008',
        quantity: 1200,
        receivedAt: '18/12/2025',
        expiry: '12/12/2027',
        remainingDays: 690,
      },
      {
        id: 'lot-009',
        code: 'BATCH-009',
        quantity: 800,
        receivedAt: '2/1/2026',
        expiry: '20/8/2027',
        remainingDays: 520,
      },
    ],
  },
  {
    id: 'med-005',
    name: 'Metformin 850mg',
    code: 'MED-005',
    manufacturer: 'Stada',
    category: 'Tiểu đường',
    categoryTone: 'amber',
    unit: 'Viên',
    totalStock: 50,
    status: 'low-stock',
    minStock: 200,
    price: 2500,
    description: 'Hỗ trợ kiểm soát đường huyết',
    lots: [
      {
        id: 'lot-010',
        code: 'BATCH-012',
        quantity: 50,
        receivedAt: '5/2/2026',
        expiry: '5/11/2026',
        remainingDays: 180,
      },
    ],
  },
  {
    id: 'med-006',
    name: 'Losartan 50mg',
    code: 'MED-006',
    manufacturer: 'Bidiphar',
    category: 'Tim mạch',
    categoryTone: 'violet',
    unit: 'Viên',
    totalStock: 450,
    status: 'in-stock',
    minStock: 300,
    price: 4000,
    description: 'Hạ huyết áp',
    lots: [
      {
        id: 'lot-011',
        code: 'BATCH-011',
        quantity: 200,
        receivedAt: '15/1/2026',
        expiry: '15/5/2026',
        remainingDays: 58,
      },
      {
        id: 'lot-012',
        code: 'BATCH-013',
        quantity: 250,
        receivedAt: '1/3/2026',
        expiry: '1/12/2026',
        remainingDays: 258,
      },
    ],
  },
  {
    id: 'med-007',
    name: 'Ibuprofen 400mg',
    code: 'MED-008',
    manufacturer: 'Imexpharm',
    category: 'Kháng viêm',
    categoryTone: 'rose',
    unit: 'Viên',
    totalStock: 150,
    status: 'in-stock',
    minStock: 100,
    price: 2800,
    description: 'Giảm đau, kháng viêm',
    lots: [
      {
        id: 'lot-013',
        code: 'BATCH-014',
        quantity: 150,
        receivedAt: '10/10/2025',
        expiry: '5/4/2026',
        remainingDays: 18,
      },
    ],
  },
  {
    id: 'med-008',
    name: 'Cetirizine 10mg',
    code: 'MED-009',
    manufacturer: 'Hau Giang Pharma',
    category: 'Dị ứng',
    categoryTone: 'indigo',
    unit: 'Viên',
    totalStock: 400,
    status: 'in-stock',
    minStock: 150,
    price: 1800,
    description: 'Giảm triệu chứng dị ứng',
    lots: [
      {
        id: 'lot-014',
        code: 'BATCH-015',
        quantity: 180,
        receivedAt: '22/1/2026',
        expiry: '20/10/2026',
        remainingDays: 216,
      },
      {
        id: 'lot-015',
        code: 'BATCH-016',
        quantity: 220,
        receivedAt: '2/2/2026',
        expiry: '2/11/2026',
        remainingDays: 229,
      },
    ],
  },
];

const statusStyles: Record<MedicineStatus, { label: string; className: string }> = {
  'in-stock': {
    label: 'Còn hàng',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  'low-stock': {
    label: 'Sắp hết',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  'out-of-stock': {
    label: 'Hết hàng',
    className: 'bg-rose-50 text-rose-600 border-rose-200',
  },
};

const categoryStyles: Record<CategoryTone, string> = {
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-100 text-blue-600',
  sky: 'bg-sky-100 text-sky-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-700',
  violet: 'bg-violet-100 text-violet-600',
  rose: 'bg-rose-100 text-rose-600',
  indigo: 'bg-indigo-100 text-indigo-600',
};

const getRemainingBadgeStyle = (days: number) => {
  if (days <= 14) {
    return 'bg-red-600 text-white';
  }
  if (days <= 30) {
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
  if (days <= 90) {
    return 'bg-amber-50 text-amber-600 border border-amber-200';
  }
  return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
};

const formatNumber = (value: number) => value.toLocaleString('en-US');

const PharmacyInventory = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MedicineStatus>('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([medicines[0]?.id ?? '']);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);

  const totalTypes = medicines.length;
  const totalLots = medicines.reduce((sum, item) => sum + item.lots.length, 0);
  const lowStockCount = medicines.filter((item) => item.status === 'low-stock').length;

  const expiringLots = useMemo(() => {
    return medicines.flatMap((item) =>
      item.lots
        .filter((lot) => lot.remainingDays <= 90)
        .map((lot) => ({
          medicineName: item.name,
          medicineCode: item.code,
          ...lot,
        }))
    );
  }, []);

  const expiringLotCount = expiringLots.length;

  const filteredMedicines = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return medicines.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch =
        normalized.length === 0 ||
        item.name.toLowerCase().includes(normalized) ||
        item.code.toLowerCase().includes(normalized) ||
        item.manufacturer.toLowerCase().includes(normalized);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const lowStockItems = useMemo(() => {
    return medicines.filter((item) => item.totalStock < item.minStock);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Kho thuốc</h1>
          <p className="text-sm text-gray-500">Quản lý danh mục và tồn kho thuốc theo lô</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9.5 12 5l4.5 4.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTypes}</p>
                <p className="text-sm text-gray-500">Loại thuốc</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{totalLots}</p>
                <p className="text-sm text-emerald-600">Lô thuốc</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-amber-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h12" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18 9 2 2-2 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{lowStockCount}</p>
                <p className="text-sm text-amber-600">Sắp hết hàng</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-rose-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-700">{expiringLotCount}</p>
                <p className="text-sm text-rose-600">Lô sắp hết hạn</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'Tất cả thuốc' },
            { key: 'low-stock', label: 'Sắp hết hàng', count: lowStockCount },
            { key: 'expiring', label: 'Lô sắp hết hạn', count: expiringLotCount },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as InventoryTab)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'border-gray-200 bg-white text-gray-900 shadow-sm'
                    : 'border-transparent bg-gray-100 text-gray-600'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-semibold ${
                      tab.key === 'low-stock'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'all' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Danh sách thuốc theo lô</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Tìm kiếm thuốc..."
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
                  onChange={(event) => setStatusFilter(event.target.value as MedicineStatus | 'all')}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="in-stock">Còn hàng</option>
                  <option value="low-stock">Sắp hết</option>
                  <option value="out-of-stock">Hết hàng</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {filteredMedicines.map((item) => {
                const isExpanded = expandedItems.includes(item.id);
                return (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-semibold text-gray-900">{item.name}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                categoryStyles[item.categoryTone]
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.code} | {item.manufacturer} | {item.lots.length} lô
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatNumber(item.totalStock)}
                          </p>
                          <p className="text-xs text-gray-500">{item.unit}</p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusStyles[item.status].className
                          }`}
                        >
                          {statusStyles[item.status].label}
                        </span>
                        <button
                          onClick={() => setSelectedMedicine(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:text-blue-600"
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16" />
                          </svg>
                          Danh sách lô thuốc ({item.lots.length} lô)
                        </div>
                        <div className="mt-3 overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="text-left text-xs uppercase text-gray-400">
                              <tr>
                                <th className="px-2 py-2">Mã lô</th>
                                <th className="px-2 py-2">Số lượng</th>
                                <th className="px-2 py-2">Ngày nhập</th>
                                <th className="px-2 py-2">Hạn sử dụng</th>
                                <th className="px-2 py-2">Còn lại</th>
                                <th className="px-2 py-2">Ghi chú</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700">
                              {item.lots.map((lot) => (
                                <tr
                                  key={lot.id}
                                  className={`border-t border-gray-100 ${lot.note ? 'bg-rose-50/40' : ''}`}
                                >
                                  <td className="px-2 py-3">{lot.code}</td>
                                  <td className="px-2 py-3">
                                    {formatNumber(lot.quantity)} {item.unit}
                                  </td>
                                  <td className="px-2 py-3">{lot.receivedAt}</td>
                                  <td className="px-2 py-3">{lot.expiry}</td>
                                  <td className="px-2 py-3">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getRemainingBadgeStyle(
                                        lot.remainingDays
                                      )}`}
                                    >
                                      {lot.remainingDays} ngày
                                    </span>
                                  </td>
                                  <td className="px-2 py-3 text-gray-500">{lot.note ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredMedicines.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  Không tìm thấy thuốc phù hợp với bộ lọc hiện tại.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'low-stock' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-base font-semibold text-amber-700">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m18 9 2 2-2 2" />
              </svg>
              Thuốc sắp hết hàng
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Mã thuốc</th>
                    <th className="px-3 py-2">Tên thuốc</th>
                    <th className="px-3 py-2">Tổng tồn kho</th>
                    <th className="px-3 py-2">Tồn tối thiểu</th>
                    <th className="px-3 py-2">Cần nhập thêm</th>
                    <th className="px-3 py-2">Số lô</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {lowStockItems.map((item) => {
                    const needToOrder = Math.max(item.minStock - item.totalStock, 0);
                    return (
                      <tr key={item.id} className="border-t border-amber-100">
                        <td className="px-3 py-3 font-medium text-gray-800">{item.code}</td>
                        <td className="px-3 py-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="px-3 py-3 font-semibold text-amber-600">
                          {formatNumber(item.totalStock)} {item.unit}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          {formatNumber(item.minStock)} {item.unit}
                        </td>
                        <td className="px-3 py-3 font-semibold text-blue-600">
                          {formatNumber(needToOrder)} {item.unit}
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700">
                            {item.lots.length}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'expiring' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-base font-semibold text-rose-700">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Lô thuốc sắp hết hạn (trong 3 tháng)
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Mã lô</th>
                    <th className="px-3 py-2">Tên thuốc</th>
                    <th className="px-3 py-2">Số lượng</th>
                    <th className="px-3 py-2">Ngày nhập</th>
                    <th className="px-3 py-2">Hạn sử dụng</th>
                    <th className="px-3 py-2">Còn lại</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {expiringLots.map((lot) => (
                    <tr key={lot.id} className="border-t border-rose-100">
                      <td className="px-3 py-3 font-medium text-gray-800">{lot.code}</td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-gray-900">{lot.medicineName}</p>
                        <p className="text-xs text-gray-500">{lot.medicineCode}</p>
                      </td>
                      <td className="px-3 py-3">{formatNumber(lot.quantity)} Viên</td>
                      <td className="px-3 py-3">{lot.receivedAt}</td>
                      <td className="px-3 py-3 font-semibold text-rose-600">{lot.expiry}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getRemainingBadgeStyle(
                            lot.remainingDays
                          )}`}
                        >
                          {lot.remainingDays} ngày
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết thuốc</h3>
                <p className="text-sm text-gray-500">Thông tin tổng quan và các lô thuốc</p>
              </div>
              <button
                onClick={() => setSelectedMedicine(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-blue-600"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8c0-2.2 1.8-4 4-4h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{selectedMedicine.name}</p>
                <p className="text-sm text-gray-500">{selectedMedicine.manufacturer}</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    categoryStyles[selectedMedicine.categoryTone]
                  }`}
                >
                  {selectedMedicine.category}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">Mã thuốc</p>
                <p className="font-semibold text-gray-900">{selectedMedicine.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Đơn vị tính</p>
                <p className="font-semibold text-gray-900">{selectedMedicine.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng tồn kho</p>
                <p className="font-semibold text-blue-600">
                  {formatNumber(selectedMedicine.totalStock)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Đơn giá</p>
                <p className="font-semibold text-gray-900">{formatNumber(selectedMedicine.price)} đ</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tồn tối thiểu</p>
                <p className="font-semibold text-gray-900">{formatNumber(selectedMedicine.minStock)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Số lô</p>
                <p className="font-semibold text-gray-900">{selectedMedicine.lots.length} lô</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500">Mô tả</p>
              <p className="text-sm text-gray-700">{selectedMedicine.description}</p>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16" />
                </svg>
                Chi tiết các lô thuốc
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-xs uppercase text-gray-400">
                    <tr>
                      <th className="px-2 py-2">Mã lô</th>
                      <th className="px-2 py-2">Số lượng</th>
                      <th className="px-2 py-2">Ngày nhập</th>
                      <th className="px-2 py-2">Hạn sử dụng</th>
                      <th className="px-2 py-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {selectedMedicine.lots.map((lot) => (
                      <tr key={lot.id} className="border-t border-gray-100">
                        <td className="px-2 py-3">{lot.code}</td>
                        <td className="px-2 py-3">{formatNumber(lot.quantity)}</td>
                        <td className="px-2 py-3">{lot.receivedAt}</td>
                        <td className="px-2 py-3">{lot.expiry}</td>
                        <td className="px-2 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getRemainingBadgeStyle(
                              lot.remainingDays
                            )}`}
                          >
                            {lot.remainingDays} ngày
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyInventory;
