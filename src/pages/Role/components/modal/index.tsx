import { Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useStore from "@/store/useStore";
import { useCallback, useEffect } from "react";
import useDeleteRole from "../../hooks/useDeleteRole";

type ConfirmDeleteRoleModalProps = {
  open: boolean;
};

const ConfirmDeleteRoleModal = ({ open }: ConfirmDeleteRoleModalProps) => {
  const blur = useStore((state) => state.behaviour.modal.blur);
  const loading = useStore((state) => state.behaviour.loading);
  const roleID = useStore((state) => state.behaviour.modal.identifier);
  const cancelHandler = useCallback(() => {
    blur();
  }, [blur]);
  useEffect(() => {}, [roleID]);
  const deleteByID = useDeleteRole();
  const deleteHandler = useCallback(() => {
    deleteByID(roleID as string);
  }, [deleteByID, roleID]);
  if (!open) return null;
  return (
    <Modal
      open
      onCancel={cancelHandler}
      footer={null}
      centered
      maskClosable={false}
      closable={!loading}
      className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0"
    >
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ExclamationCircleFilled />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Xác nhận xóa vai trò</h3>
            <p className="mt-1 text-sm text-slate-600">Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={cancelHandler} disabled={loading} className="rounded-lg">
            Hủy
          </Button>
          <Button danger type="primary" onClick={deleteHandler} loading={loading} className="rounded-lg">
            Xóa vai trò
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteRoleModal;
