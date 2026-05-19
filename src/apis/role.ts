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

  // Create
  async addRole(data: Omit<RoleRow, "roleID">) {
    const fetched = await apiClient.post("/admin/role/", data);
    return fetched.data.data;
  }

  async updateRole(id: string, data: Omit<RoleRow, "roleID">) {
    const fetched = await apiClient.patch("/admin/role/" + id, data);
    return fetched.data.data;
  }

  async deleteRole(id: string) {
    const fetched = await apiClient.delete("/admin/role/" + id);
    return fetched.data.data;
  }
}

export default new RoleAPI();
