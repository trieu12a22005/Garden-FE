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
    console.log("examinations:", examinations);
    const rows: ExaminationRow[] = examinations?.map((item:ExaminationTicket) => ({
        ticketID: item.ticketID,
        orderNum: item.orderNum,
        fullName: item.patient.account.fullName,
        roomName: "ABC",
        DisplayID: item.patient.account.DisplayID,
        checkIn: item.checkIn,
        status: item.status,
        note: item.note,
        length: item.length,
        patientID: item.patientID,
        genderDisplay: item.patient.account.genderDisplay,
        address: item.patient.account.address,
    }));
    console.log("rows:" ,rows);
    return (
        <div>
             <WaitingRoom data = {rows} />
        </div>
    );
}
export default Examination;