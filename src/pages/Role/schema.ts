import * as z from "zod";
export const roleSchema = z
  .object({
    roleName: z.string().trim().min(1, "Phải nhập thông tin này"),
    roleDescription: z.string().trim().min(1, "Phải nhập thông tin này").optional(),
    permissions: z.array(z.uuid("Nhập đúng tất cả mã quyền")),
  })
  .required();
