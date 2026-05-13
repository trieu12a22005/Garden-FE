import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import RoleAPI from "@/apis/role";
import type { RoleRow } from "@/types/role";

/* 

key: code 
key code, id: details of 

*/
function useRole(): UseQueryResult<RoleRow[], Error>;
function useRole(id: string): UseQueryResult<RoleRow, Error>;
function useRole(id?: string) {
  // _ is for all, and id is for specific items
  const identifier = typeof id === "string" ? id : "_";
  const _ = useQuery<RoleRow[] | RoleRow | undefined>({
    queryKey: ["role", identifier],
    queryFn: async () => {
      if (!id) {
        return await RoleAPI.getRolesList();
      } else {
        return await RoleAPI.getRoleDetails(id);
      }
    },
    select: (data) => {
      return data;
    },
  });
  return _;
}

export default useRole;
