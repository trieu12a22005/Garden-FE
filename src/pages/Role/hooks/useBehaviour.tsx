import { useContext } from "react";
import { EditRoleBehaviorContext } from "../context/behaviour";

function useBehaviour() {
  return useContext(EditRoleBehaviorContext);
}

export default useBehaviour;
