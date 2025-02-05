import { StateCreator } from "zustand"
import { UIState } from "../../../providers/types"

export const createUISlice: StateCreator<UIState> = (set) => ({
  modals: {},
  setModalVisible: (modalId: string, visible: boolean) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: visible,
      },
    })),
})
