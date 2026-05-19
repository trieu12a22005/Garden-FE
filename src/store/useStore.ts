import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type StoreProps = {
  behaviour: {
    loading: boolean;
    setLoading: (v: boolean) => void;
    form: {
      name?: string;
      hasInput: boolean;
      trigger: (name: string) => void;
      blur: () => void;
    };

    modal: {
      identifier?: string;
      open: boolean;
      trigger: (name: string) => void;
      blur: () => void;
    };
  };
};

const useStore = create<StoreProps>()(
  immer((set) => ({
    behaviour: {
      loading: false,
      setLoading(v: boolean) {
        set((state) => {
          state.behaviour.loading = v;
        });
      },
      form: {
        name: "",
        hasInput: false,

        // Actions:
        trigger(name: string) {
          set((state) => {
            state.behaviour.form.name = name;
            state.behaviour.form.hasInput = true;
          });
        },
        blur() {
          set((state) => {
            state.behaviour.form.name = "";
            state.behaviour.form.hasInput = false;
          });
        },
      },
      modal: {
        identifier: "",
        open: false,
        trigger(name: string) {
          set((state) => {
            state.behaviour.modal.identifier = name;
            state.behaviour.modal.open = true;
          });
        },
        blur() {
          set((state) => {
            state.behaviour.modal.identifier = "";
            state.behaviour.modal.open = false;
          });
        },
      },
    },
  }))
);

export default useStore;
