import { Avatar, Box, HStack, Progress, Spacer, Text } from "@chakra-ui/react";
import DetailTaskLateralLabels from "./components/DetailTaskLateralLabels";
import DetailTaskLateralDue from "./components/DetailTaskLateralDue";
import { TagType } from "@/src/types/TagType";
import { useTaskStore } from "@/src/hooks/useTask";
import { useEffect } from "react";
import { AttachmentFileType } from "@/src/types/AttachmentFileType";
import { StateTask } from "@/src/types/TaskType";
import ListAttachmentsItem from "../Task/components/ListAttachmentsItem";
import { UserSessionType } from "@/src/types/UserSessionType";

interface DetailTaskLateralFeature {
    assignedOf: UserSessionType[]
    tags: TagType[]
    deadline: Date
    attachments?: AttachmentFileType[]
    progressTask: number
    stateTask: StateTask
}

export default function DetailTaskLateralFeature(props: DetailTaskLateralFeature): JSX.Element {

    const {
        assignedOf,
        tags,
        deadline,
        attachments,
        progressTask,
        stateTask
    } = props

    const setProgressTask = useTaskStore(state => state.setProgressTask)
    const progress = useTaskStore(state => state.progressTask)
    const state = useTaskStore(state => state.stateTask)
    const setStateTask = useTaskStore(state => state.setStateTask)

    useEffect(() => {
        setProgressTask(progressTask)
        setStateTask(stateTask)
    }, [])

    useEffect(() => {

        if (progress > 0 && progress < 100) {
            setStateTask("Em andamento")
        } else if (progress === 100) {
            setStateTask("Em revisão")
        } else if (progress === 0) {
            setStateTask("Não iniciada")
        }

    }, [progress])

    function handleOpenFile(path: string) {
        window.open(path, "_blank")
    }

    return (
        <Box
            w={'md'}
            ml={5}
        >
            {
                assignedOf.length > 0 ?
                    <Text
                        fontSize={"sm"}
                        fontWeight={'semibold'}
                    >
                        Atribuída a
                    </Text>
                    :
                    <Text
                        fontSize={"sm"}
                        fontWeight={'semibold'}
                    >
                        Tarefa não atribuída
                    </Text>
            }

            <HStack>
                {
                    assignedOf.map((user, index) => (
                        <Avatar
                            key={index}
                            name={user.displayName}
                            src={user.photoUrl as string | undefined}
                            size={"sm"}
                        />
                    ))
                }
            </HStack>
            <Spacer height={6} />
            <HStack
                justifyContent={'space-between'}
            >
                <Text
                    fontSize={"sm"}
                    fontWeight={'semibold'}
                >
                    Progresso
                </Text>
                <Text
                    fontSize={"sm"}
                    fontWeight={'semibold'}
                >
                    {`${progress.toFixed(1)}%`}
                </Text>
            </HStack>
            <Progress
                value={progress}
                colorScheme="red"
                bg={'#eaeaea'}
                borderRadius={8}
            />
            <Spacer height={6} />
            <Text
                fontSize={"sm"}
                fontWeight={'semibold'}
            >
                Estado
            </Text>
            <Text
                fontSize={"sm"}
                fontWeight={'regular'}
            >
                {state}
            </Text>
            <Spacer height={6} />
            <Text
                fontSize={"sm"}
                fontWeight={'semibold'}
            >
                Etiquetas
            </Text>
            <DetailTaskLateralLabels
                tags={tags}
            />
            <Spacer height={6} />
            <DetailTaskLateralDue
                deadline={deadline}
            />
            <Spacer height={6} />
            {
                attachments && attachments.length > 0 ?
                    <Text
                        fontSize={"sm"}
                        fontWeight={'semibold'}
                    >
                        Anexos
                    </Text> : null
            }
            {
                attachments?.map((attach, index) => (
                    <ListAttachmentsItem
                        key={index}
                        fileName={attach.fileName}
                        filePath={attach.fileUrl}
                        onOpenFile={handleOpenFile}
                    />
                ))
            }
        </Box>
    )
}