import { Button, Input, Table } from "antd";
import { useMemo, useState } from "react";
import "./table.css";
import { useNavigate } from "react-router-dom";
import type { RoleRow } from "@/types/role";
import { columns } from "./column";
import useRole from "../../hooks/useRole";

const styles = {
  toolbar: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center",
  searchWrapper: "flex w-full flex-1 items-center gap-2",
  searchInput: "flex-1",
  createButton: "shrink-0",
  table:
    "w-full [&_.ant-table]:bg-transparent [&_.ant-table-container]:border-0 [&_.ant-table-thead>tr>th]:bg-transparent [&_.ant-table-thead>tr>th]:text-[16px] [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:text-3xl [&_.ant-table-thead>tr>th]:text-red-400 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-slate-800/70 [&_.ant-table-tbody>tr>td]:bg-transparent [&_.ant-table-tbody>tr>td]:text-red-200 [&_.ant-table-tbody>tr>td]:py-4 [&_.ant-table-tbody>tr>td]:border-0",
};

const RoleTable = () => {
  const navigate = useNavigate();
  const { data } = useRole();
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    // Custom search
    if (!Array.isArray(data)) {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return data;
    }

    return data.filter((role) => {
      const name = role.roleName ?? "";
      const description = role.roleDescription ?? "";
      return `${name} ${description}`.toLowerCase().includes(normalizedQuery);
    });
  }, [data, query]);

  // Fake data
  // console.log(Array.isArray(data));

  return (
    <div className="role_table">
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <label className="sr-only" htmlFor="role-search">
            Tìm kiếm vai trò
          </label>
          <Input
            id="role-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm vai trò"
            className={styles.searchInput}
          />
        </div>
        <Button type="primary" danger onClick={() => navigate("/role/details/new")} className={styles.createButton}>
          Tạo mới
        </Button>
      </div>

      <Table<RoleRow>
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        rowKey="roleID"
        rowClassName={() => "border-b border-slate-800/70 cursor-pointer"}
        onRow={(record) => ({
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("/role/details/" + record.roleID);
          },
        })}
        // locale={{ emptyText: <p> No user found</p> }}
        className={styles.table}
      />
    </div>
  );
};

export default RoleTable;
