import { create } from "zustand";
import { StepsAuth } from "../enums/StepsAuth";

interface State {
    isModalOpen: boolean
    stepsAuth: StepsAuth
    selectedTab: number
    isTourOpened: boolean
}

interface Actions {
    onModalOpen: () => void;
    onModalClose: () => void;
    setSelectedTab: (arg: number) => void
    backToSelectedTabBefore: () => void
    setToOpenTour: (value: boolean) => void
}

//const { setIsOpen } = useReactTour()

const initialState: State = {
    isModalOpen: false,
    isTourOpened: false,
    stepsAuth: StepsAuth.AUTHENTICATION,
    selectedTab: 0,
}

export const useAppStore = create<Actions & State>((set) => ({
    ...initialState,
    setSelectedTab: (selectedTab: number) => set({ selectedTab }),
    backToSelectedTabBefore: () => set((state) => ({ selectedTab: state.selectedTab - 1 })),
    onModalOpen: () => set({ isModalOpen: true }),
    onModalClose: () => set({ isModalOpen: false }),
    setToOpenTour: (isTourOpened: boolean) => {
        set({ isTourOpened })
    }
}));