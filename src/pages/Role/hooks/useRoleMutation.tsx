import { notifyError } from "@/utils/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import RoleAPI from "@/apis/role";
import type { RoleRow } from "@/types/role";
import useStore from "@/store/useStore";
import useBehaviour from "./useBehaviour";

type Req = {
  payload: Omit<RoleRow, "roleID">;
  id?: string;
};

function useRoleMutation(mode?: string) {
  const { id } = useParams();
  // State management
  const [_, trigger] = useBehaviour();
  const setLoading = useStore((state) => state.behaviour.setLoading);
  const blur = useStore((state) => state.behaviour.form.blur);

  // Todo: merge into one zustand control

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (req: Req) => {
      if (mode === "edit") {
        // Update current role
        return await RoleAPI.updateRole(req.id as string, req.payload);
      } else {
        // Create new
        return await RoleAPI.addRole(req.payload);
      }
    },
    onMutate() {
      setLoading(true);
    },
    onSuccess(role, req) {
      // queryClient.invalidateQueries({ queryKey: ["role"] });
      if (mode === "new") {
        const { roleID } = role;
        const cachedRole = {
          ...req.payload,
          roleID,
        };
        queryClient.setQueryData(["role", roleID], cachedRole);

        const { permissions, ...lite } = cachedRole;
        queryClient.setQueryData(["role", "_"], (old: unknown) => {
          return old ? [...(old as RoleRow[]), lite] : [lite];
        });
      } else if (mode === "edit") {
        if (id) queryClient.invalidateQueries({ queryKey: ["role", id], fetchStatus: "idle" });
        queryClient.invalidateQueries({ queryKey: ["role", "_"], fetchStatus: "idle" });
      }
    },
    onError() {
      notifyError("Đã có lỗi xảy ra. Vui lòng thử lại sau");
    },
    onSettled() {
      setLoading(false);
      blur();
      if (trigger) trigger("reset");
    },
  });
  const handler = useCallback(
    (payload: unknown) => {
      mutate({
        payload: payload as Omit<RoleRow, "roleID">,
        id,
      });
    },
    [mutate, id]
  );
  return handler;
}

export default useRoleMutation;
