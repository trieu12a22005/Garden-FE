import { useQuery, useQueryClient } from "@tanstack/react-query";
import RoleAPI from "@/apis/role";
import { useEffect } from "react";

const query = {
  queryKey: ["permission"],
  queryFn: async () => {
    const data = await RoleAPI.getPermissionList();
    return data;
  },
  staleTime: 7 * 24 * 3600,
  gcTime: 7 * 24 * 3600,
};

function usePermission() {
  const _ = useQuery(query);
  return _;
}
export function usePrefetchPermission() {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(query);
  }, [queryClient]);
}

export default usePermission;
