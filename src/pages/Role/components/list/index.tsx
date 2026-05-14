import { Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import type { RoleRow } from "@/types/role";
import useRole from "../../hooks/useRole";
import { useCallback } from "react";
import useStore from "@/store/useStore";
import { notifyError } from "@/utils/notify";

const styles = {
  table: `
    w-full
    [&_.ant-table]:bg-transparent
    [&_.ant-table_table]:border-separate
    [&_.ant-table_table]:[border-spacing:0_5px]
    [&_.ant-table_table]:[border-collapse:separate]
    [&_.ant-table_table]:!border-separate
    [&_.ant-table_table]:![border-spacing:0_5px]
    [&_.ant-table_table]:![border-collapse:separate]
    [&_.ant-table table]:!border-separate
    [&_.ant-table table]:![border-spacing:0_5px]
    [&_.ant-table table]:![border-collapse:separate]
    [&_.ant-table-container]:border-0
    [&_.ant-table-tbody>tr>td]:bg-white/70
    [&_.ant-table-tbody>tr>td]:!py-1
    [&_.ant-table-tbody>tr>td]:!px-2
    [&_.ant-table-tbody>tr>td]:!border-0
    [&_.ant-table-tbody>tr>td]:rounded-lg
    [&_.ant-table-selection-column]:hidden

  `,
};

function RoleCompactList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useRole();
  const roles = Array.isArray(data) ? data : [];
  // const roles: RoleRow[] = Array.from({ length: 20 }, (_, index) => ({
  //   roleID: `role-${index + 1}`,
  //   roleName: `Role ${index + 1}`,
  // }));
  const columns = [
    {
      dataIndex: "roleName",
      key: "roleName",
      render: (value: string) => <span className="text-sm font-medium text-slate-800">{value}</span>,
    },
  ];

  const hasInput = useStore((state) => state.behaviour?.form?.hasInput);
  const viewRolePage = useCallback(
    (id: string) => {
      if (!hasInput) navigate(`/role/details/${id}`);
      else notifyError("Bạn phải hoàn thành mọi thay đổi trước khi rời đi");
    },
    [hasInput, navigate]
  );

  return (
    <div className="bg-transparent/80 backdrop-blur">
      {data && (
        <Table<RoleRow>
          columns={columns}
          dataSource={roles}
          loading={isLoading}
          showHeader={false}
          pagination={false}
          rowKey="roleID"
          rowClassName={() => "cursor-pointer transition-colors hover:bg-amber-50/70"}
          onRow={(record) => ({
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              viewRolePage(record.roleID);
            },
          })}
          rowSelection={{ type: "radio", renderCell: () => null, selectedRowKeys: id ? [id] : undefined }}
          className={styles.table}
        />
      )}
    </div>
  );
}

export default RoleCompactList;
