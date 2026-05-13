import RoleTable from "../components/table";
import { usePrefetchPermission } from "../hooks/usePermission";

function RoleDashboardPage() {
  usePrefetchPermission();
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className=" role-dashboard__hero p-[18px] rounded-3xl bg-amber-600 grid gap-[12px] text-white border-2 border-amber-700 mb-8">
        <h1 className="text-2xl font-bold ">Quản lý phân quyền</h1>
        <p className="role-dashboard__description">
          Trang này cho phép xem, tạo, chỉnh sửa và gán vai trò cho người dùng; thiết lập và quản lý quyền truy cập đến
          các chức năng của hệ thống.
        </p>
      </div>

      <RoleTable />
    </div>
  );
}
export default RoleDashboardPage;
