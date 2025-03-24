import { create } from "zustand";

import { PlanType } from "../types/PlanType";
import { PlanService } from "../services/firebase/firestore/PlanService";

const initialState: State = {
    plans: [],
    loadingPlans: false,
    messageError: null,
    refresh: 0
}

interface State {
    plans: PlanType[]
    loadingPlans: boolean
    messageError: string | null
    refresh: number
}

interface Actions {
    getAllPlans(): void
}

export const usePlan = create<Actions & State>()((set) => ({
    ...initialState,
    getAllPlans: async () => {
        try {

            set({ loadingPlans: true })
            const plans = await PlanService.shared.getAllPlans()
            set({
                plans,
                loadingPlans: false
            })
        } catch (error) {
            set({ 
                messageError: "Ocorreu um erro desconhecido.",
                loadingPlans: false 
            })
        }
    },
}))