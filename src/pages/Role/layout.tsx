import { Outlet } from "react-router-dom";

function RoleLayout() {
  return (
    <div className="p-[24px] gap-3">
      <Outlet />
    </div>
  );
}
export default RoleLayout;
