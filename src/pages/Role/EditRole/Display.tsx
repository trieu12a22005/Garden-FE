import { Input, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import useTriggerInput from "../hooks/useTriggerInput";
import { useEffect } from "react";

function RoleDisplay() {
  useEffect(() => {
    console.log("Mounted role dp");
  }, []);
  const triggerSavePromptHandler = useTriggerInput();
  const { control, setValue } = useFormContext();
  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="roleName"
        render={({ field }) => {
          const { value } = field;

          return (
            <>
              <div className="flex gap-[18px] items-center">
                <p className="text-[18px] inline-block  shrink-0">
                  <span>Code * </span>
                  <Tooltip title="Mã của vai trò viết bằng tiếng Anh">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </p>
                <Input
                  value={value}
                  onChange={(x) => {
                    setValue("roleName", x.target.value);
                  }}
                  onInput={triggerSavePromptHandler}
                  style={{ fontSize: 18 }}
                />
              </div>
            </>
          );
        }}
      />
      <Controller
        control={control}
        name="roleDescription"
        render={({ field }) => {
          const { value } = field;
          return (
            <>
              <div className="flex gap-[18px] items-center">
                <span className="text-[18px] inline-block  shrink-0">Tên vai trò </span>
                <Input
                  value={value}
                  onChange={(x) => {
                    setValue("roleDescription", x.target.value);
                  }}
                  onInput={triggerSavePromptHandler}
                  style={{ fontSize: 18 }}
                />
              </div>
            </>
          );
        }}
      />
    </div>
  );
}
export default RoleDisplay;
