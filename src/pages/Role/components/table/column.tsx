import type { RoleRow } from "@/types/role";
import type { ColumnsType } from "antd/es/table";
import { Dropdown } from "antd";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
export const columns: ColumnsType<RoleRow> = [
  {
    title: "Tên vai trò",
    dataIndex: "roleDescription",
    key: "roleDescription",
    render: (value: string) => (
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-black">{value}</span>
      </div>
    ),
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 120,
    align: "right",
    render: (_, { roleID }) => (
      <div className="flex items-center justify-end gap-2">
        <button type="button" className="ant-table-icon bg-green-600/60" aria-label="Edit role" title="Sửa vai trò">
          <EditOutlined style={{ fontSize: 24 }} />
        </button>
        <Dropdown
          menu={{
            items: [
              { key: "delete-role", label: "Xóa vai trò" },
              { key: "copy-role-id", label: "Copy ID" },
            ],
            onClick: (e) => {
              e.domEvent.stopPropagation();
              if (e.key === "copy-role-id") {
                navigator.clipboard.writeText(String(roleID));
              }
              if (e.key === "delete-role") {
                console.log("delete role", roleID);
              }
            },
          }}
        >
          <button
            type="button"
            className="ant-table-icon bg-gray-500"
            aria-label="More options"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>
    ),
  },
];
