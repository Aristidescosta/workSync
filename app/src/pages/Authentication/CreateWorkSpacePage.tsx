import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToastMessage } from '@/react-toastify';
import { StepsAuth } from '@/src/enums/StepsAuth';
import { useUserSessionStore } from '@/src/hooks';
import { useTeamStore } from '@/src/hooks/useTeam';
import { useWorkspaceStore } from '@/src/hooks/useWorkspace';
import { WorkspaceType } from '@/src/types/WorkspaceType';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

interface ICreateWorkspacePageProps {
    workspace?: WorkspaceType
    onClose?: () => void
}


export const CreateWorkSpacePage = (props: ICreateWorkspacePageProps) => {

    const {
        workspace,
        onClose,
    } = props;

    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)
    const createNewWorkspace = useWorkspaceStore(state => state.createNewWorkspace)
    const setWorkspaceName = useWorkspaceStore(state => state.setWorkspaceName)
    const loadingWorkspaces = useWorkspaceStore(state => state.loadingWorkspaces)
    const setWorkspaceDescription = useWorkspaceStore(state => state.setWorkspaceDescription)
    const workspaceName = useWorkspaceStore(state => state.workspaceName)
    const team = useTeamStore(state => state.team)
    const workspaceDescription = useWorkspaceStore(state => state.workspaceDescription)
    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)
    const editWorkspace = useWorkspaceStore(state => state.editWorkspace)

    const { toastMessage, ToastStatus, } = useToastMessage();
    const form = useForm()
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
                        setStepsAuth(StepsAuth.HOME)
                    }
                })
                .catch(error => {
                    toastMessage({
                        title: error,
                        statusToast: ToastStatus.WARNING
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
                        title: error,
                        statusToast: ToastStatus.WARNING,
                    });
                })
        }
    }
    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="..."
                render={(field) => (
                    <FormItem>
                        <FormLabel>
                            Nome do Workspace
                        </FormLabel>
                        <FormControl>
                            <Input onChange={(e) => onChangeWorkspaceName(e)} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="..."
                render={(field) => (
                    <FormItem>
                        <FormLabel>
                            Descrição
                        </FormLabel>
                        <FormControl>
                            <Textarea onChange={(e) => onChangeWorkspaceDescription(e)} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button
                variant={"secondary"}
                disabled={loadingWorkspaces}
                onClick={workspace ? () => handleEditWorkspace(workspace) : handleCreateWorkspace}
            >
                {
                    loadingUserSession ?
                        (
                            <>
                                <Loader2 className="animate-spin" />
                                <Label>Criando o workspace</Label>
                            </>
                        )
                        :
                        <Label>Continuar</Label>
                }
            </Button>
        </Form>

    )
}