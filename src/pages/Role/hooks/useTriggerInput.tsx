import { useCallback } from "react";
import useBehaviour from "./useBehaviour";
import useStore from "@/store/useStore";

function useTriggerInput() {
  // Zustand store
  const setFormBehaviour = useStore((state) => state.behaviour.form.trigger);
  // Local context
  const [_, trigger] = useBehaviour();
  const { needSave } = _ || {};
  const fn = useCallback(() => {
    if (trigger && needSave === false) {
      trigger("needSave");
      setFormBehaviour("role.create");
    }
  }, [needSave, trigger, setFormBehaviour]);
  return fn;
}
export default useTriggerInput;
