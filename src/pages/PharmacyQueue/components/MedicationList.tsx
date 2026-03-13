import type { PrescriptionItem } from '../data';
import type { SelectedLot } from './types';
import MedicationItem from './MedicationItem';

interface MedicationListProps {
  items: PrescriptionItem[];
  expandedItems: string[];
  selectedLots: Record<string, SelectedLot[]>;
  onToggleItem: (itemId: string) => void;
  onSelectLot: (itemId: string, lotId: string) => void;
  onRemoveLot: (itemId: string, lotId: string) => void;
  onQtyChange: (itemId: string, lotId: string, nextValue: number) => void;
  onAutoSelect: (item: PrescriptionItem) => void;
  getTotalSelected: (itemId: string) => number;
}

const MedicationList = ({
  items,
  expandedItems,
  selectedLots,
  onToggleItem,
  onSelectLot,
  onRemoveLot,
  onQtyChange,
  onAutoSelect,
  getTotalSelected,
}: MedicationListProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5h8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
        </span>
        Danh sách thuốc - Chọn lô để bóc
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <MedicationItem
            key={item.id}
            item={item}
            isExpanded={expandedItems.includes(item.id)}
            totalSelected={getTotalSelected(item.id)}
            selectedLots={selectedLots[item.id] ?? []}
            onToggle={onToggleItem}
            onSelectLot={onSelectLot}
            onRemoveLot={onRemoveLot}
            onQtyChange={onQtyChange}
            onAutoSelect={onAutoSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default MedicationList;
