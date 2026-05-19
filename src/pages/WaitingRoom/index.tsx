import ListWaitingRoom from "./component/Waitingroom";
import { UseExamination } from "./UseExamination";
const WaitingRoomPage = () => {
    const { examinations } = UseExamination({
        roomID: "8041c2ff-71fc-4baa-ba44-87f5e3cc87aa",
        status: "pending",
        page: 1,
        limit: 10,
    });
    console.log("examinations:", examinations);

    return (
        <div>
            <ListWaitingRoom data={examinations || []} />
        </div>
    );
}
export default WaitingRoomPage;