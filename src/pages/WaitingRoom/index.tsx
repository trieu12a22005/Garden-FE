import ListWaitingRoom from "./component/Waitingroom";
import { UseExamination } from "./UseExamination";
import type { EnterTicket, EnterTicketRow } from "@/types/EnterTicket";

const WaitingRoomPage = () => {
    const { examinations } = UseExamination({
        roomID: "dd7a68c5-c2ca-47b0-95d1-c8584022028f",
        status: "pending",
        page: 1,
        limit: 10,
    });
    console.log("examinations:", examinations);
    const rows:EnterTicketRow[] = examinations?.map((item:EnterTicket) => ({
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
             <ListWaitingRoom data = {rows} />
        </div>
    );
}
export default WaitingRoomPage;