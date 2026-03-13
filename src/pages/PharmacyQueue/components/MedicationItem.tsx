import type { PrescriptionItem } from '../data';
import type { SelectedLot } from './types';

const toneClasses: Record<string, string> = {
  orange: 'bg-orange-100 text-orange-600',
  green: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const day = parsed.getDate().toString().padStart(2, '0');
  const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
};

const getDaysRemaining = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const now = new Date();
  const diff = parsed.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

interface MedicationItemProps {
  item: PrescriptionItem;
  isExpanded: boolean;
  totalSelected: number;
  selectedLots: SelectedLot[];
  onToggle: (itemId: string) => void;
  onSelectLot: (itemId: string, lotId: string) => void;
  onRemoveLot: (itemId: string, lotId: string) => void;
  onQtyChange: (itemId: string, lotId: string, nextValue: number) => void;
  onAutoSelect: (item: PrescriptionItem) => void;
}

const MedicationItem = ({
  item,
  isExpanded,
  totalSelected,
  selectedLots,
  onToggle,
  onSelectLot,
  onRemoveLot,
  onQtyChange,
  onAutoSelect,
}: MedicationItemProps) => {
  const remaining = Math.max(item.requiredQty - totalSelected, 0);
  const totalStock = item.lots.reduce((sum, lot) => sum + lot.stock, 0);

  return (
    <div className="rounded-xl border border-gray-200">
      <button
        onClick={() => onToggle(item.id)}
        className="flex w-full items-center justify-between gap-4 rounded-xl bg-white px-4 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-500">
              {item.code} | {item.instruction}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-orange-600">
            {totalSelected} / {item.requiredQty} {item.unit}
          </p>
          <p className="text-xs text-gray-500">Tồn kho: {totalStock} {item.unit}</p>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-[#fbfcff] px-5 pb-5 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="font-semibold">Liều dùng:</span>
              {item.usage.map((usage) => (
                <span
                  key={usage.label}
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${toneClasses[usage.tone]}`}
                >
                  {usage.label}
                </span>
              ))}
            </div>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onAutoSelect(item);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:text-blue-600"
            >
              Tự động chọn (FEFO)
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h10" />
              </svg>
              Chọn lô thuốc ({item.lots.length} lô có sẵn)
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Mã lô</th>
                    <th className="px-3 py-2">Tồn kho</th>
                    <th className="px-3 py-2">Hạn SD</th>
                    <th className="px-3 py-2">Còn lại</th>
                    <th className="px-3 py-2 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {item.lots.map((lot) => {
                    const selected = selectedLots.some((selectedLot) => selectedLot.lotId === lot.id);
                    const daysLeft = getDaysRemaining(lot.expiry);

                    return (
                      <tr key={lot.id} className="border-t border-gray-100">
                        <td className="px-3 py-2 font-medium text-gray-700">{lot.code}</td>
                        <td className="px-3 py-2 text-gray-600">{lot.stock} {item.unit}</td>
                        <td className="px-3 py-2 text-gray-600">{formatDate(lot.expiry)}</td>
                        <td className="px-3 py-2">
                          {daysLeft !== null ? (
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                daysLeft <= 60
                                  ? 'bg-amber-100 text-amber-600'
                                  : 'bg-emerald-100 text-emerald-600'
                              }`}
                            >
                              {daysLeft} ngày
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => onSelectLot(item.id, lot.id)}
                            disabled={selected}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              selected
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                            }`}
                          >
                            {selected ? 'Đã chọn' : 'Chọn lô'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-700">Lô đã chọn - Nhập số lượng bóc:</p>
            <div className="mt-3 space-y-3">
              {selectedLots.length === 0 && (
                <p className="text-sm text-gray-400">Chưa chọn lô thuốc nào.</p>
              )}
              {selectedLots.map((selectedLot) => {
                const lotInfo = item.lots.find((lot) => lot.id === selectedLot.lotId);
                if (!lotInfo) return null;
                const maxQty = lotInfo.stock;
                const inputValue = Math.min(selectedLot.qty, maxQty);

                return (
                  <div
                    key={selectedLot.lotId}
                    className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        {lotInfo.code}
                      </span>
                      <span className="text-xs text-gray-500">HSD: {formatDate(lotInfo.expiry)}</span>
                      <span className="text-xs text-gray-500">Tồn: {lotInfo.stock} {item.unit}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-500">SL:</label>
                      <input
                        type="number"
                        min={0}
                        max={maxQty}
                        value={inputValue}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          const nextValue = Number.isNaN(value)
                            ? 0
                            : Math.max(0, Math.min(maxQty, Math.floor(value)));
                          onQtyChange(item.id, selectedLot.lotId, nextValue);
                        }}
                        className="w-24 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                      />
                      <button
                        onClick={() => onRemoveLot(item.id, selectedLot.lotId)}
                        className="text-sm font-semibold text-red-500 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-right text-sm font-semibold text-gray-600">
              Tổng đã chọn: <span className="text-blue-600">{totalSelected}</span> / {item.requiredQty} {item.unit}
              {remaining > 0 && <span className="text-orange-500"> (Còn thiếu {remaining})</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationItem;
