import WaitingRoom from "@/components/WaitingRoom/Waitingroom";
import { UseExamination } from "./UseExamination";
import type { ExaminationRow, ExaminationTicket } from "@/types/examinationType";

const Examination = () => {
    const { examinations } = UseExamination({
        roomID: "dd7a68c5-c2ca-47b0-95d1-c8584022028f",
        status: "pending",
        page: 1,
        limit: 10,
    });
    const rows: ExaminationRow[] = examinations?.map((item:ExaminationTicket) => ({
        ticketID: item.ticketID,
        orderNum: item.orderNum,
        fullName: item.patient.account.fullName,
        roomName: item.room.roomName,
        checkIn: item.checkIn,
        status: item.status,
        note: item.note,
        length: item.length,
        patientID: item.patientID,
    }));
    console.log("rouws:" ,rows);
    return (
        <div>
             <WaitingRoom data = {rows} />
        </div>
    );
}
export default Examination;