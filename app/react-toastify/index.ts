import { Bounce, ToastPosition, toast } from "react-toastify"

enum ToastStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning',
    LOADING = 'loading',
}

type toastMessageProps = {
    title: string
    theme?: "light" | "dark"
    statusToast: ToastStatus
    duration?: number
    closeOnClick?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    position?: ToastPosition | undefined
    isLoading?: boolean
}

export function useToastMessage() {

    /**
     * Exibe uma mensagem toast com base nos parâmetros fornecidos.
     * 
     * @param title {string} - Título da mensagem toast.
     * @param theme {string} [optional] - Tema do toast ("light" ou "dark").
     * @param statusToast {ToastStatus} - Status do toast (sucesso, erro, etc.).
     * @param duration {number} [optional] - Duração em milissegundos do toast. Se não fornecido, o valor padrão é 3000ms.
     * @param closeOnClick {boolean} [optional] - Define se o toast pode ser fechado ao clicar.
     * @param pauseOnHover {boolean} [optional] - Define se o toast deve pausar ao passar o mouse.
     * @param draggable {boolean} [optional] - Define se o toast pode ser arrastado.
     * @param position {ToastPosition} [optional] - Define a posição do toast na tela.
     * @param isLoading {boolean} [optional] - Define se o toast está no estado de carregamento.
     */
    function toastMessage(params: toastMessageProps) {
        toast[params.statusToast](params.title, {
            position: params.position ?? "bottom-center",
            isLoading: params.isLoading ?? false,
            closeOnClick: params.closeOnClick ?? false,
            pauseOnHover: params.pauseOnHover ?? true,
            draggable: params.draggable ?? true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        })
    }

    return {
        toastMessage,
        ToastStatus,
    }
}
