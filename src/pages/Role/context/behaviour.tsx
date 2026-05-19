import { createContext, type ActionDispatch } from "react";
export type EditRoleBehaviorContextProps = [{ needSave: boolean }, ActionDispatch<[action: string]>] | [];
export const EditRoleBehaviorContext = createContext<EditRoleBehaviorContextProps>([]);
