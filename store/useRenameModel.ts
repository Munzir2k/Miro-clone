import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface RenameModelState {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
  // onSubmit: (values: typeof defaultValues) => void
}

export const useRenameModel = create<RenameModelState>((set) => ({
  isOpen: false,
  onOpen: (id, title) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () => set({ isOpen: false, initialValues: defaultValues }),
  initialValues: defaultValues,
}));
