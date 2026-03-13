export type PrescriptionMedicine = {
  medicineName: string;
  quantity: number;
  usage: string;
};

export type PrescriptionPdfData = {
  name: string;
  phone: string;
  date: string;
  gender: string;
  address: string;
  weight: string;
  pressure: string;
  type: string;
  symptom: string;
  diagnose: string;
  note: string;
  medicines: PrescriptionMedicine[];
};