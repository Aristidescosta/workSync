import { Menu, MenuButton, Image, MenuList, MenuItem, Text, HStack, Divider } from "@chakra-ui/react";
import { WorkspaceType } from "../types/WorkspaceType";
import { ZenTaakIcon } from "@/react-icons";
import { useEffect, useState } from "react";
import { useWorkspaceStore } from "../hooks/useWorkspace";
import { useTeamStore } from "../hooks/useTeam";
import { useAppStore } from "../hooks/useAppStore";
import { useIntegrationStore } from "../hooks/useIntegration";
import { useTaskStore } from "../hooks/useTask";

interface WorkspaceSelectorList {
    onWorkspaceSelected: (workspace: WorkspaceType) => void
}

export default function WorkspaceSelectorList(props: WorkspaceSelectorList): JSX.Element {

    const {
        onWorkspaceSelected
    } = props

    const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([])

    const workspace = useWorkspaceStore(state => state.workspace)
    const observingAllWorkspaces = useWorkspaceStore(state => state.observingAllWorkspaces)

    const clearTasks = useTaskStore(state => state.clearTasks)

    const fetchIntegrationWithGithubData = useIntegrationStore(state => state.fetchIntegrationWithGithubData)

    const setSelectedTab = useAppStore(state => state.setSelectedTab)

    const team = useTeamStore(state => state.team)

    useEffect(() => {
        if (team) {
            const unsubscribe = observingAllWorkspaces(team.teamId, (workspace, isRemoving) => {
                if (workspace) {
                    setWorkspaces(state => [...state, workspace])
                }
            })

            return () => {
                setWorkspaces([])
                unsubscribe()
            }
        }

    }, [team])

    function goToMyWorkspaces() {
        setSelectedTab(2)
    }

    function getIntegration(workspace: WorkspaceType) {
        fetchIntegrationWithGithubData(workspace.workspaceId)
        clearTasks()
        onWorkspaceSelected(workspace)
    }

    return (
        <Menu>
            <MenuButton
                px={4}
                py={2}
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                className="workspace"
            >
                <HStack>
                    {
                        workspace ?
                            <>
                                <Image
                                    src="/isologo.svg"
                                    alt="Zen Taak"
                                    h={4}
                                />
                                <Text>{workspace.workspaceName}</Text>
                            </>
                            :
                            <>
                                <ZenTaakIcon
                                    package="githubocticonsicons"
                                    name="GoDot"
                                />
                                <Text>Nenhum workspace</Text>
                            </>
                    }
                    <ZenTaakIcon
                        package="githubocticonsicons"
                        name="GoTriangleDown"
                    />
                </HStack>
            </MenuButton>
            <MenuList>
                {
                    workspaces.map((workspace, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => getIntegration(workspace)}
                        >
                            <Image
                                src="/isologo.svg"
                                alt="Zen Taak"
                                h={4}
                                mr='12px'
                            />
                            <span>{workspace.workspaceName}</span>
                        </MenuItem>
                    ))
                }
                <Divider />
                <MenuItem
                    onClick={goToMyWorkspaces}
                    icon={
                        <ZenTaakIcon
                            package="githubocticonsicons"
                            name="GoStack"
                            size={18}
                        />
                    }
                >
                    Meus workspaces
                </MenuItem>
            </MenuList>
        </Menu>
    )
}