export interface GetExaminationsParams {
  status?: string;
  roomID?: string;
  page?: number;
  limit?: number;
}
export interface GetExaminationsResponse {
  data: ExaminationTicket[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemCount: number;
  };
}

export interface ExaminationTicket {
  ticketID: string;
  orderNum: number;
  appointmentID: string;
  patientID: string;
  roomID: string;
  checkIn: string;
  status: string;
  note: string;
  length?: number;
  patient: {
    patientID: string;
    account: {
      fullName: string;
      DisplayID: string;
      address: string;
      phone: string;
      genderDisplay: string;
    };
  };
  room: {
    roomID: string;
    roomName: string;
  };
}
export interface ExaminationRow {
  ticketID: string;
  orderNum: number;
  fullName: string;
  roomName: string;
  checkIn: string;
  status: string;
  note: string;
  length: number;
  patientID: string;
  DisplayID: string;
  address: string;
  genderDisplay: string;
}