import { useCallback } from "react";
import useBehaviour from "./useBehaviour";

function useTriggerInput() {
  const [_, trigger] = useBehaviour();
  const { needSave } = _ || {};
  const fn = useCallback(() => {
    if (trigger && needSave === false) {
      console.log("I need to save");
      trigger("needSave");
    }
  }, [needSave, trigger]);
  return fn;
}
export default useTriggerInput;
