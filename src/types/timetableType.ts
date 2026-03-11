export interface TimetableResponse {
        timeID: string;
        doctorID: string;
        roomID: string;
        dayOfWeek: string;
        note: string;
        createdAt: string;
        doctor: {
            doctorID: string;
            startDate: string;
            fromFaculty: string | null;
            status: string;
            account: {
                firstName: string;
                lastName: string;
                email: string;
            };
        };
        room: {
            roomName: string;
            faculty: {
                facultyName: string;
            };
        };
        createdAtLocal: string;
    };
