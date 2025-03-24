import { TourProvider, ProviderProps, StepType, useTour, PopoverContentProps } from '@reactour/tour'
import { PropsWithChildren } from 'react'

export default function ReactTourProvider(props: PropsWithChildren<ProviderProps>): JSX.Element {
    return <TourProvider {...props} />
}

export const useReactTour = useTour

export const steps: StepType[] = [
    {
        selector: ".workspace",
        content: "Aqui você seleciona todos os teus workspaces."
    },
    {
        selector: ".tasks",
        content: "Poderás visualizar as tarefas neste separador..."
    },
    {
        selector: "#buttonCreateTask",
        content: "... e neste botão, criarás as tuas primeiras tarefas."
    },
    {
        selector: ".notification",
        content: "Todas as notificações encontrarás aqui."
    },
    {
        selector: ".inbox",
        content: "Aqui encontrarás solicitações para ingressar noutras equipas e outras informações relevantes."
    },
    {
        selector: ".profile",
        content: "Ao clicar sobre o teu Avatar, terás acesso as opções de menu para Trocar de Equipa ou Terminar a Sessão."
    }
]