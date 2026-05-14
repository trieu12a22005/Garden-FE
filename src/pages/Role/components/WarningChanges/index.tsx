import { Button } from "antd";
import useBehaviour from "../../hooks/useBehaviour";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import useStore from "@/store/useStore";
import useRoleMutation from "../../hooks/useRoleMutation";
import type { EditRolePageProps } from "../../EditRole";
import DelayedLoading from "@/components/DelayLoading";

function WarningChanges({ mode }: EditRolePageProps) {
  const blur = useStore((state) => state.behaviour.form.blur);
  const loading = useStore((state) => state.behaviour.loading);
  const { reset, handleSubmit } = useFormContext();
  const [behaviour, trigger] = useBehaviour();
  const resetHandler = useCallback(() => {
    if (trigger) trigger("reset");
    reset();
    blur();
  }, [trigger, blur, reset]);
  const handler = useRoleMutation(mode);

  if (!behaviour?.needSave) return null;

  return (
    <>
      <DelayedLoading loading={loading} minDuration={300} msg="Đang lưu. Hãy chờ trong giây lát" />
      <div className="sticky bottom-[24px] z-50">
        <div className="mx-auto w-full max-w-5xl ">
          <div className="mt-[24px] flex flex-col items-start gap-4 rounded-xl border border-amber-400/40 bg-neutral-900/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-neutral-100">
              <div className="leading-tight">
                <div className="font-semibold">Cẩn thận - Bạn đang chỉnh sửa chi tiết phân quyền</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Button
                type="text"
                onClick={resetHandler}
                className="h-9 w-full rounded-md border border-transparent !text-blue-300 hover:!text-blue-200 sm:w-auto"
              >
                Đặt lại
              </Button>
              <Button
                onClick={handleSubmit(handler)}
                type="primary"
                className="h-9 w-full rounded-md !bg-blue-500 !text-white hover:!bg-blue-800 sm:w-auto"
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WarningChanges;
