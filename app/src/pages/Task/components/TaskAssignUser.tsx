import { ZenTaakIcon } from "@/react-icons";
import { ZenTaakModal } from "@/src/components/ZenTaakModal";
import { useNotificationStore } from "@/src/hooks/useNotification";
import { useTaskStore } from "@/src/hooks/useTask";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import generateId from "@/src/services/UUID";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { UserOnNotificationMessage } from "@/src/types/NotificationType";
import { TaskType } from "@/src/types/TaskType";
import { UserSessionType } from "@/src/types/UserSessionType";
import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface TaskAssignUser extends iModalPage {
    task: TaskType
}

export default function TaskAssignUser(props: TaskAssignUser): JSX.Element {

    const {
        isOpen,
        onClose,
        task,
    } = props

    const [members, setMembers] = useState<UserSessionType[]>([])
    const [selectedMembers, setSelectedMembers] = useState<UserSessionType[]>([])

    const [assignedOf, setAssignedOf] = useState<string[]>([])
    const [unAssignedOf, setUnAssignedOf] = useState<UserSessionType[]>([])

    const membersOfTeam = useTeamStore(state => state.membersOfTeam)
    const team = useTeamStore(state => state.team)

    const user = useUserSessionStore(state => state.user)

    const workspace = useWorkspaceStore(state => state.workspace)

    const sendMessageNotification = useNotificationStore(state => state.sendMessageNotification)

    const setTaskSelected = useTaskStore(state => state.setTaskSelected)
    const assignUserToTask = useTaskStore(state => state.assignUserToTask)
    const saveLogs = useTaskStore(state => state.saveLogs)

    const { toastMessage, ToastStatus } = useToastMessage()


    useEffect(() => {

        if (isOpen) {
            const members: UserSessionType[] = []

            for (const assigned of task.assignedOf) {
                setAssignedOf(state => [...state, assigned.id])
            }

            for (const user of membersOfTeam) {
                members.push(user.value)
            }
            setTaskSelected(task)
            setMembers(members)
        }

    }, [membersOfTeam, isOpen])

    async function handleSelectedMembers(selectedUser: UserSessionType) {
        try {
            if (selectedMembers.includes(selectedUser)) {
                setSelectedMembers(state => state.filter(u => u !== selectedUser))
            } else {
                setSelectedMembers(state => [...state, selectedUser])
            }
            setMembers(state => state.filter(u => u.id !== selectedUser.id))
        } catch (error) {
            toastMessage({
                title: "Atribuição de tarefa",
                description: error as string,
                statusToast: ToastStatus.WARNING,
                position: "bottom",
            })
        }
    }

    async function handleRemoveAssignedUser(assignedUser: UserSessionType) {
        try {
            let assignedOfUsers = [...task.assignedOf]
            task.assignedOf = task.assignedOf.filter(ass => ass.id !== assignedUser.id)

            setUnAssignedOf(state => {
                if (assignedOfUsers.length === 0) {
                    return state
                } else {
                    const userExist = assignedOfUsers.includes(assignedUser)

                    if (userExist) {
                        return [...state, assignedUser]
                    }
                    return state
                }
            })
            setAssignedOf(state => state.filter(id => id !== assignedUser.id))
            setMembers(state => {
                if (state.filter(u => u.id === assignedUser.id).length === 1) {
                    return state
                }

                return [...state, assignedUser]
            })
            setSelectedMembers(state => state.filter(u => u.id !== assignedUser.id))
            assignedOfUsers = assignedOfUsers.filter(ass => ass.id !== assignedUser.id)
        } catch (error) {
            toastMessage({
                title: "Atribuição de tarefa",
                description: error as string,
                statusToast: ToastStatus.WARNING,
                position: "bottom",
            });
        }
    }

    async function saveRemovedAssignedUsers() {
        if (user) {
            await assignUserToTask(task, user.session, unAssignedOf, true)
            if (unAssignedOf.filter(u => u.id === user.session.id).length === 1) {
                await saveLogs({
                    logId: generateId(),
                    action: "removeu-se",
                    createAt: new Date(),
                    data: "desta tarefa",
                    icon: "GoPerson",
                    user
                })
            } else {
                await saveLogs({
                    logId: generateId(),
                    action: "removeu",
                    createAt: new Date(),
                    data: `${unAssignedOf.map(u => u.displayName).join(', ')} desta tarefa`,
                    icon: "GoPerson",
                    user
                })
            }
        }
    }

    async function handleOnCloseComplete() {
        if (selectedMembers.length !== 0) {

            if (user) {

                const notifyAddressTo: UserOnNotificationMessage[] = []

                await assignUserToTask(task, user.session, selectedMembers.map(u => u), false)
                for (const userAssigned of selectedMembers) {

                    notifyAddressTo.push({
                        displayName: userAssigned.displayName,
                        email: userAssigned.email,
                        phoneNumber: userAssigned.phoneNumber
                    })

                    if (userAssigned.id === user.session.id) {
                        await saveLogs({
                            logId: generateId(),
                            action: "atribuiu-se",
                            createAt: new Date(),
                            data: "à esta tarefa",
                            icon: "GoPerson",
                            user
                        })
                    } else {
                        await saveLogs({
                            logId: generateId(),
                            action: "atribuiu",
                            createAt: new Date(),
                            data: `${userAssigned.displayName} esta tarefa`,
                            icon: "GoPerson",
                            user
                        })
                    }
                }
                if (workspace && team) {
                    await sendMessageNotification(
                        workspace.team.owner.session.id,
                        {
                            userAddressTo: [...new Set(notifyAddressTo)],
                            taskName: task.taskTitle,
                            teamName: team.teamName,
                            userNameNotificationFrom: user.session.displayName,
                            workspaceName: workspace.workspaceName
                        },
                        "task_assigned"
                    )
                }
            }
        }

        if (unAssignedOf.length !== 0) {
            saveRemovedAssignedUsers()
        }

        setSelectedMembers([])
        setTaskSelected(null)
        setMembers([])
        setAssignedOf([])
        onClose()
    }

    return (
        <ZenTaakModal
            title="Colaboradores"
            subtitle={`Selecione os colaboradores que desejas atribuir a tarefa ${task.taskTitle}`}
            isOpen={isOpen}
            position="relative"
            onClose={handleOnCloseComplete}
        >
            <Box>
                {
                    members.filter(m => assignedOf.includes(m.id) !== true).length === 0 ?
                        null
                        :
                        <Text
                            fontSize={'18'}
                            fontWeight={'500'}
                            pb={2}
                            color={'gray.300'}
                        >
                            Não atribuídos à tarefa
                        </Text>
                }
                {
                    members.filter(m => assignedOf.includes(m.id) !== true).map((user, index) => (
                        <HStack
                            key={index}
                            py={2}
                            cursor={'pointer'}
                        >
                            <HStack
                                onClick={() => handleSelectedMembers(user)}
                                w={'full'}
                            >
                                <Avatar
                                    name={user.displayName}

                                    borderRadius='full'
                                    src={user.photoUrl as string | undefined}
                                    mr='12px'
                                />
                                <span>{user.displayName}</span>
                            </HStack>
                            {
                                selectedMembers.includes(user) ?
                                    <ZenTaakIcon
                                        package={"githubocticonsicons"}
                                        name={"GoCheck"}
                                    />
                                    :
                                    null
                            }
                        </HStack>
                    ))
                }
                {
                    (task.assignedOf.concat(selectedMembers)).length > 0 ?
                        <Text
                            fontSize={'18'}
                            fontWeight={'500'}
                            py={2}
                            color={'gray.300'}
                        >
                            Atribuídos à tarefa
                        </Text>
                        :
                        null
                }
                {
                    (task.assignedOf.concat(selectedMembers)).map((user, index) => (
                        <HStack
                            key={index}
                            py={2}
                            cursor={'pointer'}
                        >
                            <HStack
                                onClick={() => handleRemoveAssignedUser(user)}
                                w={'full'}
                            >
                                <Avatar
                                    name={user.displayName}

                                    borderRadius='full'
                                    src={user.photoUrl as string | undefined}
                                    mr='12px'
                                />
                                <span>{user.displayName}</span>
                            </HStack>
                            <Box
                                p={2}
                                onClick={() => handleRemoveAssignedUser(user)}
                            >
                                <ZenTaakIcon
                                    package={"githubocticonsicons"}
                                    name={"GoX"}
                                    size={20}
                                />
                            </Box>
                        </HStack>
                    ))
                }
            </Box>
        </ZenTaakModal>
    )
}