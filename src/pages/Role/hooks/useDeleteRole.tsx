import { useMutation, useQueryClient } from "@tanstack/react-query";
import RoleAPI from "@/apis/role";
import useStore from "@/store/useStore";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { RoleRow } from "@/types/role";
import { AxiosError } from "axios";
function useDeleteRole() {
  const setLoading = useStore((state) => state.behaviour.setLoading);
  const blur = useStore((state) => state.behaviour.modal.blur);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: RoleAPI.deleteRole,
    onMutate() {
      setLoading(true);
    },
    onSuccess(_, roleID) {
      queryClient.removeQueries({ queryKey: ["role", roleID] });
      queryClient.setQueryData(["role", "_"], (old: unknown) => {
        const removed = [...(old as RoleRow[])].filter((_) => _.roleID != roleID);

        return removed;
      });
      notifySuccess("Đã xóa thành công");
    },
    onError(e) {
      if (e instanceof AxiosError && e.status === 403)
        notifyError("Không thể xóa vai trò vì có người dùng đang giữ vai trò trên");
      else notifyError("Đã có lỗi xảy ra khi xóa vai trò. Hãy thử lại sau");
    },
    onSettled() {
      setLoading(false);
      blur();
    },
  });
  return mutate;
}

export default useDeleteRole;
