import { ZenTaakModal } from "@/src/components/ZenTaakModal";
import { useIntegrationStore } from "@/src/hooks/useIntegration";
import { useTaskStore } from "@/src/hooks/useTask";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";


interface CloseModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CloseTaskModal(props: CloseModalProps): JSX.Element {
    const {
        isOpen,
        onClose
    } = props

    const closeTask = useTaskStore(state => state.closeTask);
    const task = useTaskStore(state => state.task)

    const integrationWithGithub = useIntegrationStore(state => state.integrationWithGithub)


    const [loading, setLoading] = useState<boolean>(false)
    const { toastMessage, ToastStatus } = useToastMessage();

    function handleChangeState() {
        if (task) {
            closeTask(task, task.isOpen, integrationWithGithub, task?.gitHubIssueId)
                .then(() => {
                    setLoading(false)
                    onClose()
                    toastMessage({
                        title: "Fechar tarefa",
                        description: "Tarefa fechada",
                        statusToast: ToastStatus.SUCCESS,
                        position: "bottom",
                    });
                })
                .catch(error => {
                    setLoading(false)
                    toastMessage({
                        title: "Fechar tarefa",
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom",
                    });
                })
        }
    }

    return (
        <ZenTaakModal
            title={"Fechar tarefa"}
            subtitle={`Por favor, confirme se deseja fechar a tarefa ${task?.taskTitle}?`}
            isOpen={isOpen}
            position="relative"
            size="sm"
            onClose={onClose}
        >
            <HStack>
                <Button
                    m={2}
                    variant='secondary'
                    onClick={onClose}
                >
                    Não
                </Button>

                <Button
                    m={2}
                    variant='primary'
                    isLoading={loading}
                    loadingText="A fechar"
                    onClick={handleChangeState}
                >
                    Sim
                </Button>
            </HStack>
        </ZenTaakModal>
    )
}