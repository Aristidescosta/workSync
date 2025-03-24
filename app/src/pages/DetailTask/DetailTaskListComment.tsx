import { ToqueButton } from "@/src/components/Button";
import { Box, Text, Flex, HStack, Input } from "@chakra-ui/react";
import DetailTaskMyComment from "./components/DetailTaskMyComment";
import DetailTaskTheirComment from "./components/DetailTaskTheirComment";
import { CommentType } from "@/src/types/CommentType";
import { useEffect, useRef, useState } from "react";
import { UserType } from "@/src/types/UserType";
import ReactMentionsInput from "@/react-mentions";
import { TaskType } from "@/src/types/TaskType";
import { useCommentStore } from "@/src/hooks/useComment";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { MentionItem } from "react-mentions";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useNotificationStore } from "@/src/hooks/useNotification";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { ZenTaakIcon } from "@/react-icons";
import DetailTaskCommentAttach from "./components/DetailTaskCommentAttach";
import { useAttachmentStore } from "@/src/hooks/useAttachment";
import { useSubscriptionStore } from "@/src/hooks/useSubscription";
import { useStorage } from "@/src/hooks/useStorage";
import { ZenTaakPlanType } from "@/src/types/PlanType";
import { UserOnNotificationMessage } from "@/src/types/NotificationType";

interface DetailTaskListComment {
    task: TaskType
    user: UserType | undefined
}

export default function DetailTaskListComment(props: DetailTaskListComment): JSX.Element {

    const {
        task,
        user,
    } = props

    const comments = useCommentStore(state => state.comments)
    const message = useCommentStore(state => state.message)
    const getComments = useCommentStore(state => state.getComments)
    const saveUserComment = useCommentStore(state => state.saveUserComment)
    const mentionOnComment = useCommentStore(state => state.mentionOnComment)
    const setMessage = useCommentStore(state => state.setMessage)
    const deleteComment = useCommentStore(state => state.deleteComment)
    const clearAll = useCommentStore(state => state.clearAll)

    const uploadAttachmentFiles = useAttachmentStore(state => state.uploadAttachmentFiles)

    const team = useTeamStore(state => state.team)

    const workspace = useWorkspaceStore(state => state.workspace)

    const subscription = useSubscriptionStore(state => state.subscription)

    const totalSpace = useStorage(state => state.totalSpace)
    const totalSpaceUsed = useStorage(state => state.totalSpaceUsed)

    const [loading, setLoading] = useState<boolean>(false)

    const [userMentions, setUserMentions] = useState<MentionItem[]>([])
    const [attachOnComment, setAttachmentOnMessage] = useState<File[]>([])
    const [fileSizeExceeded, setFileSizeExceeded] = useState<boolean>(false)
    const [sizeSpaceExceeded, setSizeSpaceExceeded] = useState<boolean>(false)

    const sendNotification = useNotificationStore(state => state.sendNotification)
    const sendMessageNotification = useNotificationStore(state => state.sendMessageNotification)

    const { toastMessage, ToastStatus } = useToastMessage();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        getComments(task.taskId)

        return () => {
            clearAll()
        }
    }, [])

    useEffect(() => { }, [comments.length])

    async function handleSaveUserComment() {
        if (user) {
            setLoading(true)

            if (workspace) {

                const attachs = await uploadAttachmentFiles(user.session, workspace.workspaceId, attachOnComment)

                saveUserComment(task, user, attachs)
                    .then(() => {
                        setLoading(false)
                        setMessage("")
                        setAttachmentOnMessage([])
                    })
                    .catch(error => {
                        setLoading(false)
                        toastMessage({
                            title: "Comentário",
                            description: error,
                            statusToast: ToastStatus.INFO,
                            position: "bottom"
                        })
                    })
            }

            if (userMentions.length > 0) {
                setLoading(false)

                const to: string[] = []
                const notifyTo: string[] = []

                for (let i = 0; i < userMentions.length; i++) {
                    to.push(userMentions[i].id)
                }

                for (let j = 0; j < task.assignedOf.length; j++) {
                    if (!to.includes(task.assignedOf[j].id)) {
                        notifyTo.push(task.assignedOf[j].id)
                    }
                }

                if (to.length > 0) {
                    await sendNotification(
                        `${user.session.displayName} mencionou-te`,
                        `Você foi mencionado por ${user.session.displayName} no seu comentário na tarefa ${task.taskTitle}`,
                        [...new Set(to)],
                        "mention",
                        task,
                        workspace?.workspaceId,
                    )
                }

                if (notifyTo.length > 0) {
                    await sendNotification(
                        `${user.session.displayName} fez um comentário`,
                        `${user.session.displayName} fez um comentário na tarefa ${task.taskTitle}`,
                        [...new Set(notifyTo)],
                        "comment",
                        task,
                        workspace?.workspaceId,
                    )
                }
                setLoading(false)
                mentionOnComment(userMentions, task.assignedOf, user.session.displayName, team, task)
                    .then(() => {
                        setLoading(false)
                    })
                    .catch(error => {
                        setLoading(false)
                        toastMessage({
                            title: "Comentário",
                            description: error,
                            statusToast: ToastStatus.INFO,
                            position: "bottom"
                        })
                    })
            } else {
                mentionOnComment(userMentions, task.assignedOf, user.session.displayName, team, task)
                    .then(async () => {
                        const to: string[] = []
                        const notifyTo: string[] = []
                        const notifyAddressTo: UserOnNotificationMessage[] = []

                        for (let j = 0; j < task.assignedOf.length; j++) {
                            if (!to.includes(task.assignedOf[j].id)) {
                                notifyTo.push(task.assignedOf[j].id)
                            }
                        }

                        for (const user of task.assignedOf) {
                            notifyTo.push(user.id)
                            notifyAddressTo.push({
                                displayName: user.displayName,
                                email: user.email,
                                phoneNumber: user.phoneNumber
                            })
                        }

                        await sendNotification(
                            `${user.session.displayName} fez um comentário`,
                            `${user.session.displayName} fez um comentário na tarefa ${task.taskTitle}`,
                            notifyTo,
                            "comment",
                            task,
                            workspace?.workspaceId
                        )

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
                                "task_commented"
                            )
                        }

                        setLoading(false)
                    })
                    .catch(error => {
                        setLoading(false)
                        toastMessage({
                            title: "Comentário",
                            description: error,
                            statusToast: ToastStatus.INFO,
                            position: "bottom"
                        })
                    })
            }
        }
    }

    function showFileAttachedToUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const attachs: File[] = []
        const sizes: number[] = []
        const freeSpace = totalSpace - totalSpaceUsed
        const limitUpload = (subscription?.package as ZenTaakPlanType).feature.zenTaakDrive[1]

        if (e.target.files) {

            for (const file of e.target.files) {
                sizes.push(file.size)
            }

            const totalSize = sizes.reduce((prev, curr) => prev + curr)
            setSizeSpaceExceeded(totalSize > freeSpace)
            setFileSizeExceeded(totalSize > limitUpload)

            for (const file of e.target.files) {
                attachs.push(file)
            }
            setAttachmentOnMessage(state => [...state, ...attachs])
        }
    }

    function handleAttachOnComments() {
        document.getElementById('fileToAttach')?.click()
    }

    function handleRemoveAttach() {
        setAttachmentOnMessage([])

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        setSizeSpaceExceeded(false)
        setFileSizeExceeded(false)
    }

    function handleDeleteComment(comment: CommentType) {
        setLoading(true)
        deleteComment(task.taskId, comment.id)
            .then(() => {
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                toastMessage({
                    title: "Apagar comentário",
                    description: error,
                    statusToast: ToastStatus.INFO,
                    position: "bottom"
                })
            })
    }

    function handleMessage(value: string) {
        setUserMentions([])
        setMessage(value)
    }

    return (
        <Box>
            <Text
                fontSize={'medium'}
                fontWeight={'semibold'}
            >
                Comentários
            </Text>
            <Input
                ref={fileInputRef}
                type='file'
                id='fileToAttach'
                onChange={showFileAttachedToUpload}
                accept='image/*, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx'
                multiple
                hidden
            />
            <ReactMentionsInput
                onInputChange={handleMessage}
                value={message ?? ""}
                usersAssigned={task.assignedOf}
            />
            <HStack
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                py={2}
            >
                <HStack
                    boxSize={4}
                    w={'full'}
                    flexWrap={'wrap'}
                >
                    {
                        attachOnComment.map((file, index) => (
                            <DetailTaskCommentAttach
                                index={index}
                                key={index}
                                filename={file.name}
                                fileSize={file.size}
                                quantity={attachOnComment.length}
                            />
                        ))
                    }
                    {
                        attachOnComment.length > 0 ?
                            <Box
                                cursor={'pointer'}
                                onClick={handleRemoveAttach}
                            >
                                <ZenTaakIcon
                                    package="githubocticonsicons"
                                    name="GoTrash"
                                    size={18}
                                    color="#ff2a00"
                                />
                            </Box> : null
                    }
                </HStack>
                <Flex>
                    <ToqueButton
                        variant="ghost"
                        onClick={handleAttachOnComments}
                    >
                        <ZenTaakIcon
                            package="githubocticonsicons"
                            name="GoPaperclip"
                            size={20}
                        />
                    </ToqueButton>
                    <ToqueButton
                        bg={'red.100'}
                        variant="info"
                        py={1}
                        px={4}
                        fontSize={'sm'}
                        isLoading={loading}
                        isDisabled={message === "" || sizeSpaceExceeded || fileSizeExceeded}
                        onClick={handleSaveUserComment}
                    >
                        Enviar comentário
                    </ToqueButton>
                </Flex>
            </HStack>
            {
                fileSizeExceeded || sizeSpaceExceeded ?

                    <Text
                        fontSize={'2xs'}
                        color={'red.200'}
                        fontWeight={'600'}
                    >
                        O espaço livre de armazenamento e/ou o limte de upload não são suficientes para enviar estes ficheiros!
                    </Text> : null
            }
            {
                comments.filter(c => c.taskId === task.taskId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((comment, index) => (
                    comment.user.session.id === user?.session.id ?
                        <DetailTaskMyComment
                            key={index}
                            comment={comment}
                            onDeleteComment={handleDeleteComment}
                        />
                        :
                        <DetailTaskTheirComment
                            key={index}
                            comment={comment}
                        />
                ))
            }
        </Box>
    )
}