import { useParams } from "react-router-dom";
import useRole from "../hooks/useRole";
import { FormProvider, useForm } from "react-hook-form";

import RoleDisplay from "./Display";
import { Tabs, type TabsProps } from "antd";
import RolePermissions from "./Permissions";
import { useEffect, useMemo, useReducer, useRef } from "react";
import WarningChanges from "../WarningChanges";
import { EditRoleBehaviorContext } from "../context/behaviour";
import type { RoleRow } from "@/types/role";

interface EditRolePageProps {
  mode?: "edit" | "new";
}

function EditRolePage({ mode = "edit" }: EditRolePageProps) {
  const { id } = useParams(); // Get params ID

  const targetID = mode === "edit" ? id : null;

  const { data: role } = useRole(targetID as string);
  const form = useForm({
    defaultValues: mode === "edit" ? role : undefined,
  });
  const roleRef = useRef<RoleRow | undefined>(undefined);
  const { reset } = form;

  const behaviour = useReducer(
    (state, action) => {
      switch (action) {
        case "reset":
          return {
            ...state,
            needSave: false,
          };
        case "needSave":
        default:
          return {
            ...state,
            needSave: true,
          };
      }
    },
    {
      needSave: false,
    }
  );

  const [_, triggerAction] = behaviour;
  useEffect(() => {
    // Reset when switching to /new route
    if (mode === "new") {
      roleRef.current = {
        roleDescription: "",
        roleID: "",
        roleName: "",
        permissions: [],
      };
      reset(roleRef.current);
      triggerAction("reset");
    }
  }, [mode, reset, triggerAction]);

  useEffect(() => {
    // Only trigger to reset if the role is changed to another value from (react-query) or ([new])
    if (role && mode !== "new") roleRef.current = role;
    reset(roleRef.current);
  }, [role, mode, reset]);

  const roleDetailsTabList: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Chi tiết vai trò",
        children: (
          <FormProvider {...form}>
            <RoleDisplay />
          </FormProvider>
        ),
      },
      {
        key: "2",
        label: "Phân quyền",
        children: (
          <FormProvider {...form}>
            <RolePermissions />
          </FormProvider>
        ),
      },
      {
        key: "3",
        label: "Quản lý thành viên",
        children: "Content of Tab Pane 3",
      },
    ];
  }, [form]);

  return (
    <EditRoleBehaviorContext.Provider value={behaviour}>
      <div className="relative min-h-[calc(100vh-200px)]">
        <Tabs
          renderTabBar={(props, DefaultTabBar) => (
            <div className="bg-white sticky top-0  z-10">
              <h1 className="text-2xl">
                {mode === "edit" ? `Chi tiết vai trò - ${role?.roleDescription}` : "Thêm mới vai trò"}
              </h1>
              <DefaultTabBar {...props} style={{ background: "#fff", fontWeight: 600, zIndex: 1 }} />
            </div>
          )}
          items={roleDetailsTabList}
          defaultActiveKey="1"
        />
        <FormProvider {...form}>
          <WarningChanges />
        </FormProvider>
      </div>
    </EditRoleBehaviorContext.Provider>
  );
}
export default EditRolePage;
