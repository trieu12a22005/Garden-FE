import type { EnterTicket, EnterTicketRow } from "@/types/EnterTicket";
export const mapEnterTicketRow = (item: EnterTicket): EnterTicketRow => ({
  ticketID: item.ticketID,
  orderNum: item.orderNum,
  fullName: item.patient.account.fullName,
  roomName: "ABC",
  DisplayID: item.patient.account.DisplayID,
  checkIn: item.checkIn,
  status: item.status,
  note: item.note,
  length: item.length || 0,
  patientID: item.patientID,
  genderDisplay: item.patient.account.genderDisplay,
  address: item.patient.account.address,
});

export const mapEnterTicketRows = (items: EnterTicket[]): EnterTicketRow[] =>
  items.map(mapEnterTicketRow);