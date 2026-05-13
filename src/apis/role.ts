import type { RoleRow } from "@/types/role";
import { apiClient } from "./axios";
class RoleAPI {
  async getRolesList(): Promise<RoleRow[]> {
    const fetched = await apiClient.get("/admin/role");
    return fetched.data.data;
  }
  async getRoleDetails(id: string) {
    const fetched = await apiClient.get("/admin/role/" + id);
    return fetched.data.data;
  }
  async getPermissionList() {
    // Get all permissions
    const fetched = await apiClient.get("/admin/permission");
    return fetched.data.data;
  }
}

export default new RoleAPI();
