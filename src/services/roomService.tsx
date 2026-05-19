import roomApi from '@/apis/room';
import type { Room } from '@/types/roomType';
import { useQuery } from '@tanstack/react-query';

const RoomService = () => {
    const query = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await roomApi.getRooms();
            return res.rooms as Room[];
        }
    });
    return {
        rooms: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};
export default RoomService;
