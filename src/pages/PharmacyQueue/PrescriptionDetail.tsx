import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PrescriptionItem } from './data';
import { prescriptions } from './data';
import ConfirmDispenseModal from './components/ConfirmDispenseModal';
import DetailHeader from './components/DetailHeader';
import DoctorNoteCard from './components/DoctorNoteCard';
import MedicationList from './components/MedicationList';
import PrescriptionInfoCards from './components/PrescriptionInfoCards';
import type { ConfirmationItem, SelectedLot } from './components/types';

const PrescriptionDetail = () => {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const prescription =
    prescriptions.find((item) => item.id === prescriptionId) ?? prescriptions[0];

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedLots, setSelectedLots] = useState<Record<string, SelectedLot[]>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (prescription) {
      setExpandedItems(prescription.items.length > 0 ? [prescription.items[0].id] : []);
      setSelectedLots({});
      setConfirmOpen(false);
    }
  }, [prescription.id]);

  if (!prescription) {
    return null;
  }

  const getTotalSelected = (itemId: string) => {
    return (selectedLots[itemId] ?? []).reduce((sum, item) => sum + item.qty, 0);
  };

  const handleToggleItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectLot = (itemId: string, lotId: string) => {
    setSelectedLots((prev) => {
      const current = prev[itemId] ?? [];
      if (current.some((lot) => lot.lotId === lotId)) {
        return prev;
      }
      return {
        ...prev,
        [itemId]: [...current, { lotId, qty: 0 }],
      };
    });
  };

  const handleRemoveLot = (itemId: string, lotId: string) => {
    setSelectedLots((prev) => {
      const current = prev[itemId] ?? [];
      return {
        ...prev,
        [itemId]: current.filter((lot) => lot.lotId !== lotId),
      };
    });
  };

  const handleQtyChange = (itemId: string, lotId: string, nextValue: number) => {
    setSelectedLots((prev) => {
      const current = prev[itemId] ?? [];
      const updated = current.map((lot) => {
        if (lot.lotId !== lotId) {
          return lot;
        }
        return { ...lot, qty: nextValue };
      });
      return { ...prev, [itemId]: updated };
    });
  };

  const handleAutoSelect = (item: PrescriptionItem) => {
    const sortedLots = [...item.lots].sort(
      (a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
    );
    let remaining = item.requiredQty;
    const nextSelections: SelectedLot[] = [];

    sortedLots.forEach((lot) => {
      if (remaining <= 0) return;
      const qty = Math.min(lot.stock, remaining);
      if (qty > 0) {
        nextSelections.push({ lotId: lot.id, qty });
        remaining -= qty;
      }
    });

    setSelectedLots((prev) => ({
      ...prev,
      [item.id]: nextSelections,
    }));
  };

  const confirmationItems = useMemo<ConfirmationItem[]>(() => {
    return prescription.items
      .map((item) => {
        const lots = (selectedLots[item.id] ?? [])
          .filter((lot) => lot.qty > 0)
          .map((lot) => {
            const lotInfo = item.lots.find((lotItem) => lotItem.id === lot.lotId);
            return {
              code: lotInfo?.code ?? lot.lotId,
              qty: lot.qty,
            };
          });
        return { item, lots };
      })
      .filter((item) => item.lots.length > 0);
  }, [prescription.items, selectedLots]);

  const canConfirm = prescription.items.every(
    (item) => getTotalSelected(item.id) >= item.requiredQty
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <DetailHeader
          prescriptionId={prescription.id}
          onBack={() => navigate('/pharmacy-queue')}
        />

        <PrescriptionInfoCards
          patient={prescription.patient}
          doctor={prescription.doctor}
          diagnosis={prescription.diagnosis}
          createdAt={prescription.createdAt}
        />

        <MedicationList
          items={prescription.items}
          expandedItems={expandedItems}
          selectedLots={selectedLots}
          onToggleItem={handleToggleItem}
          onSelectLot={handleSelectLot}
          onRemoveLot={handleRemoveLot}
          onQtyChange={handleQtyChange}
          onAutoSelect={handleAutoSelect}
          getTotalSelected={getTotalSelected}
        />

        <DoctorNoteCard note={prescription.note} />

        <div className="flex flex-wrap justify-end gap-3">
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-800">
            In đơn thuốc
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!canConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              canConfirm
                ? 'bg-[#1867c0] hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Xác nhận phát thuốc
          </button>
        </div>
      </div>

      <ConfirmDispenseModal
        open={confirmOpen}
        patientName={prescription.patient.name}
        confirmationItems={confirmationItems}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default PrescriptionDetail;
