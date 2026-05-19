export interface Room {
    roomID: string;
    roomName: string;
    roomType: string;
    status: string;
    faculty?: {
        facultyID: string;
        facultyName: string;
    } | null;
}
