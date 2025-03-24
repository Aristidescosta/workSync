import { ZenTaakIcon } from "@/react-icons";
import TagsSelected from "@/src/components/TagsSelected";
import { TaskType } from "@/src/types/TaskType";
import { Avatar, AvatarGroup, Box, Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";
import TaskMenuContext from "./TaskMenuContext";
import TaskAssignUser from "./TaskAssignUser";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/src/hooks/useTask";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useUserSessionStore } from "@/src/hooks/useUserSession";

interface RowCardableTask {
    task: TaskType
    onEditTask: (task: TaskType, option: number) => void
    onCloseTask: (task: TaskType, option: number) => void
    onTaskSelected: (task: TaskType, option: number) => void
}

export default function RowCardableTask(props: RowCardableTask): JSX.Element {

    const {
        task,
        onEditTask,
        onCloseTask,
        onTaskSelected
    } = props

    const [numberOfComments, setNumberOfComments] = useState<number>(0)


    const { isOpen: isOpenTaskAssignUsers, onClose: onCloseTaskAssignUsers, onOpen: onOpenTaskAssignUsers } = useDisclosure()

    const observingCommentOnTask = useTaskStore(state => state.observingCommentOnTask)
    const team = useTeamStore(state => state.team)
    const user = useUserSessionStore(state => state.userSession)

    useEffect(() => {
        const unsubscribe = observingCommentOnTask(task.taskId, setNumberOfComments)
        return () => unsubscribe()
    }, [])

    function ActivityIcon(): JSX.Element {
        return (
            <ZenTaakIcon
                package="githubocticonsicons"
                name="GoChecklist"
                size={16}
            />
        )
    }

    function checkIfUserIsOwner() {
        if (team?.owner.session.id === user?.id) {
            return true
        } else {
            return false
        }
    }

    function ActivityIconAttach(): JSX.Element {
        return (
            <ZenTaakIcon
                package="ionicons5"
                name="IoAttach"
                size={16}
            />
        )
    }

    function handleTaskSelected() {
        onTaskSelected(task, 0)
    }

    function handleOnMenuClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, menuPosition: number) {
        e.preventDefault()
        switch (menuPosition) {
            case 0:
                onOpenTaskAssignUsers()
                break;
            case 1:
                onEditTask(task, 1)
                break
            case 2:
                onCloseTask(task, 2)
                break
            default:
                break;
        }
    }

    return (
        <HStack
            borderBottomWidth={1}
            borderColor={'gray.100'}
            py={3}
            pl={5}
            justifyContent={'space-between'}
            cursor={'pointer'}
            _hover={{
                bg: '#fafafa',
            }}
        >
            <Box
                width={'full'}
                onClick={handleTaskSelected}
            >
                <Box
                    fontSize={22}
                    fontWeight={'bold'}
                >
                    <Flex alignItems={'center'} gap={2}>
                        {task.taskTitle}
                        {task.tags && <TagsSelected tags={task.tags} />}
                    </Flex>
                </Box>
                <Box
                    fontSize={15}
                    color={'gray.400'}
                >
                    <Flex alignItems={'center'} gap={1}>
                        {task.updatedAt ? `Actualizada ${task.updatedAt?.convertToString()} | ${task.state} |` : `Criada ${task.createdAt?.convertToString()} | ${task.state} |`}
                        <ActivityIcon /> {`${task.activities.length} ${task.activities.length < 2 ? `actividade` : `actividades`}`}
                        {task?.attachments?.length !== 0 ?
                            <Flex alignItems={'center'}>
                                <Text>{`|`}</Text>
                                <ActivityIconAttach />
                            </Flex>
                            : null}
                    </Flex>
                </Box>
            </Box>
            <HStack
                gap={10}
            >
                <AvatarGroup size={'sm'} max={2}>
                    {task.assignedOf.map((user, index) => (
                        <Avatar
                            key={index}
                            name={user.displayName}
                            src={user.photoUrl as string | undefined}
                        />
                    ))}
                </AvatarGroup>
                {
                    numberOfComments === 0 ?
                        <Box p={4} />
                        :
                        <Flex
                            alignItems={'center'}
                            gap={1}
                        >
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoComment"
                                size={16}
                            />
                            <Text
                                fontSize={'smaller'}
                                fontWeight={'500'}
                            >
                                {numberOfComments}
                            </Text>
                        </Flex>
                }
                {checkIfUserIsOwner() ?
                    <TaskMenuContext
                        menuIconButton={
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoKebabHorizontal"
                                size={18} />
                        }
                        task={task}
                        onMenuClick={handleOnMenuClick}
                    />
                    :
                    <Box 
                        boxSize={27}
                    />
                }
            </HStack>
            <TaskAssignUser
                isOpen={isOpenTaskAssignUsers}
                task={task}
                onClose={onCloseTaskAssignUsers}
            />
        </HStack>
    )
}