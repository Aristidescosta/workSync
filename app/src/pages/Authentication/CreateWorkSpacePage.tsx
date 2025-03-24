import { ToqueButton } from "@/src/components/Button";
import { StepsAuth } from "@/src/enums/StepsAuth";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { WorkspaceType } from "@/src/types/WorkspaceType";
import { FormControl, FormLabel, Input, Spacer, Textarea, VStack } from "@chakra-ui/react";
import { useEffect } from "react";

interface ICreateWorkspacePageProps {
    workspace?: WorkspaceType
    onClose?: () => void
}

export default function CreateWorkspacePage(props: ICreateWorkspacePageProps): JSX.Element {

    const {
        workspace,
        onClose,
    } = props;
    
    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)
    const createNewWorkspace = useWorkspaceStore(state => state.createNewWorkspace)
    const setWorkspaceName = useWorkspaceStore(state => state.setWorkspaceName)
    const setWorkspaceDescription = useWorkspaceStore(state => state.setWorkspaceDescription)
    const workspaceName = useWorkspaceStore(state => state.workspaceName)
    const team = useTeamStore(state => state.team)
    const workspaceDescription = useWorkspaceStore(state => state.workspaceDescription)
    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)
    const editWorkspace = useWorkspaceStore(state => state.editWorkspace)

    const { toastMessage, ToastStatus, } = useToastMessage();
    
    useEffect(() => {
        if (workspace) {
            setWorkspaceDescription(workspace.workspaceDescription);
            setWorkspaceName(workspace.workspaceName);
        }
    }, [])

    function onChangeWorkspaceName(e: React.ChangeEvent<HTMLInputElement>) {
        setWorkspaceName(e.target.value)
    }

    function onChangeWorkspaceDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setWorkspaceDescription(e.target.value)
    }

    function handleCreateWorkspace() {
        if (team) {
            createNewWorkspace(team)
                .then(() => {
                    if (onClose) {
                        onClose()
                        setWorkspaceName("")
                        setWorkspaceDescription("")
                    } else {
                        setStepsAuth(StepsAuth.PLANS)
                    }
                })
                .catch(error => {
                    toastMessage({
                        title: "Adicionar Workspace",
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom",
                    });
                })
        }
    }

    function handleEditWorkspace(workspace: WorkspaceType): void {
        if (team && workspace) {
            const EDITED_WORKSPACE: WorkspaceType = { ...workspace, workspaceName, workspaceDescription, updatedAt: new Date() }
            editWorkspace(EDITED_WORKSPACE)
                .then(() => {
                    onClose?.()
                })
                .catch(error => {
                    toastMessage({
                        title: "Editar Workspace",
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom",
                    });
                })
        }
    }

    return (
        <VStack
            width={'100%'}
        >
            <FormControl isRequired>
                <FormLabel>
                    Nome do Workspace
                </FormLabel>
                <Input
                    type="email"
                    placeholder="Ex: ToquePlay"
                    _placeholder={{
                        color: "gray.100"
                    }}
                    onChange={onChangeWorkspaceName}
                    value={workspaceName}
                />
            </FormControl>
            <Spacer />
            <FormControl>
                <FormLabel>
                    Descrição
                </FormLabel>
                <Textarea
                    placeholder="Workspace fantástico..."
                    resize='none'
                    _placeholder={{
                        color: "gray.100"
                    }}
                    onChange={onChangeWorkspaceDescription}
                    value={workspaceDescription}
                />
            </FormControl>

            <ToqueButton
                variant="primary"
                width="100%"
                mt="5"
                isDisabled={workspaceName === ""}
                isLoading={loadingUserSession}
                _disabled={{ background: "red.100", opacity: 0.5 }}
                onClick={workspace ? () => handleEditWorkspace(workspace) : handleCreateWorkspace}
            >
                Continuar
            </ToqueButton>
        </VStack>
    )
}