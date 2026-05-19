import { apiClient } from './axios';

export interface RoomOption {
  roomID: string;
  roomName: string;
  facultyID?: string;
}

type RoomsApiResponse = {
  rooms?: unknown[];
  data?: unknown;
  items?: unknown[];
};

const normalizeRoom = (item: unknown): RoomOption | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const room = item as {
    roomID?: unknown;
    roomName?: unknown;
    facultyID?: unknown;
  };

  if (typeof room.roomID !== 'string' || typeof room.roomName !== 'string') {
    return null;
  }

  return {
    roomID: room.roomID,
    roomName: room.roomName,
    facultyID: typeof room.facultyID === 'string' ? room.facultyID : undefined,
  };
};

const extractRooms = (response: RoomsApiResponse | unknown): RoomOption[] => {
  const payload =
    Array.isArray(response)
      ? response
      : Array.isArray((response as RoomsApiResponse)?.rooms)
        ? (response as RoomsApiResponse).rooms
        : Array.isArray((response as RoomsApiResponse)?.items)
          ? (response as RoomsApiResponse).items
          : Array.isArray((response as RoomsApiResponse)?.data)
            ? ((response as RoomsApiResponse).data as unknown[])
            : [];

  return payload
    .map(normalizeRoom)
    .filter((room): room is RoomOption => room !== null);
};

class RoomApi {
  async getRoomsByFaculty(facultyID: string): Promise<RoomOption[]> {
    const endpoints = ['/admin/rooms', '/admin/room'];

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get<RoomsApiResponse>(endpoint, {
          params: { facultyID },
        });
        return extractRooms(response.data);
      } catch (error) {
        const status =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof error.response === 'object' &&
          error.response !== null &&
          'status' in error.response
            ? error.response.status
            : undefined;

        if (status !== 404) {
          throw error;
        }
      }
    }

    return [];
  }
}

const roomApi = new RoomApi();

export default roomApi;
