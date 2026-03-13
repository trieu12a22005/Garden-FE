import type { PrescriptionItem } from '../data';

export type SelectedLot = { lotId: string; qty: number };

export type ConfirmationItem = {
  item: PrescriptionItem;
  lots: Array<{ code: string; qty: number }>;
};
