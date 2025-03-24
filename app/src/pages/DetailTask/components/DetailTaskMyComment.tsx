import { ZenTaakIcon } from "@/react-icons";
import { CommentType } from "@/src/types/CommentType";
import { sortEditedMessages } from "@/src/utils/helpers";
import {
    Avatar,
    Box,
    Button,
    HStack,
    HStack as EditCommentContent,
    Popover,
    Link,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useDisclosure,
    Flex,
    Textarea
} from "@chakra-ui/react";
import DetailTaskCommentHistory from "./DetailTaskCommentHistory";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import MessagePopover from "@/src/components/MessagePopover";
import { useCommentStore } from "@/src/hooks/useComment";
import { useTaskStore } from "@/src/hooks/useTask";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";

interface DetailTaskComment {
    comment: CommentType
    onDeleteComment: (comment: CommentType) => void
}

const regex = /\@\[([^\]]+)\]/g

export default function DetailTaskMyComment(props: DetailTaskComment): JSX.Element {

    const {
        comment,
        onDeleteComment
    } = props

    const { isOpen, onToggle, onClose } = useDisclosure()

    const [refresh, setRefresh] = useState<number>(Date.now())
    const [isEditComment, setIsEditComment] = useState<boolean>(false)
    const [messageEdited, setMessageEdited] = useState<string>("")

    const task = useTaskStore(state => state.task)

    const updateComment = useCommentStore(state => state.updateComment)

    const { toastMessage, ToastStatus } = useToastMessage();

    useEffect(() => {
        if (comment.edited.length > 0) {
            comment.edited.push({
                message: comment.message,
                updatedAt: Timestamp.fromDate(comment.createdAt)
            })
        }
    }, [])

    useEffect(() => {
        if (isEditComment) {
            if (comment.edited.length > 0) {
                setMessageEdited(comment.edited.sort(sortEditedMessages)[0].message.replace(regex, '@$1'))
            } else {
                setMessageEdited(comment.message.replace(regex, '@$1'))
            }
        } else {
            setMessageEdited("")
        }
    }, [isEditComment])

    useEffect(() => { }, [refresh])


    function handleUpdateComment() {
        if (task) {
            updateComment(task.taskId, comment.id, messageEdited)
                .then(() => {
                    setRefresh(Date.now())
                    handleIsEditComment()
                })
                .catch(error => {
                    handleIsEditComment()
                    toastMessage({
                        title: "Editar comentário",
                        description: error,
                        statusToast: ToastStatus.INFO,
                        position: "bottom"
                    })
                })
        }
    }

    function handleOnChangeComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setMessageEdited(e.target.value)
    }

    function handleIsEditComment() {
        setIsEditComment(state => !state)
    }

    function handleDeleteComment() {
        onDeleteComment(comment)
        onClose()
    }

    function onClickCapture() {
        setRefresh(Date.now())
    }

    return (
        <HStack
            alignItems={'flex-start'}
            py={4}
            my={2}
        >
            <Avatar
                name={comment.user.session.displayName}
                src={comment.user.session.photoUrl as string | undefined}
            />
            <Box width={'full'}>
                <HStack justifyContent={'space-between'}>
                    <HStack gap={3}>
                        <Text
                            fontSize='md'
                            fontWeight={'semibold'}
                        >
                            {comment.user.session.displayName}
                        </Text>
                        {
                            comment.edited.length > 0 ?
                                <Popover>
                                    <PopoverTrigger>
                                        <Button
                                            variant='link'
                                            onClickCapture={onClickCapture}
                                        >
                                            <Text
                                                fontSize='smaller'
                                                color={'gray.400'}
                                            >
                                                {`Editado ${comment.edited.sort(sortEditedMessages)[0].updatedAt.toDate().convertToString()}`}
                                            </Text>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>Histórico de edições</PopoverHeader>
                                        <PopoverBody>
                                            {
                                                comment.edited.map((history, index) => (
                                                    <DetailTaskCommentHistory
                                                        key={index}
                                                        message={history.message}
                                                        updateAt={history.updatedAt.toDate().convertToString()}
                                                    />
                                                ))
                                            }
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                                :
                                <Text
                                    fontSize='smaller'
                                    color={'gray.400'}
                                >
                                    {comment.createdAt.convertToString()}
                                </Text>
                        }
                    </HStack>
                    <HStack gap={4}>
                        {
                            comment.createdAt.getMinutesAfterComment() < 900000 ?
                                <Box
                                    cursor={'pointer'}
                                    onClick={handleIsEditComment}
                                >
                                    <ZenTaakIcon
                                        package="githubocticonsicons"
                                        name="GoPencil"
                                        size={16}
                                    />
                                </Box>
                                :
                                null
                        }
                        {
                            comment.attachs && comment.attachs.length > 0 ? null :
                                <MessagePopover
                                    title={"Apagar o comentário"}
                                    bodyMessage={"Deseja confirmar a eliminação do teu comentário?"}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    onOpen={onToggle}
                                    onConfirmOperation={handleDeleteComment}
                                    onButtonRender={() => <Box
                                        cursor={'pointer'}
                                    >
                                        <ZenTaakIcon
                                            package="githubocticonsicons"
                                            name="GoTrash"
                                            size={16}
                                            color="#DD0000"
                                        />
                                    </Box>}
                                />
                        }
                    </HStack>
                </HStack>
                <Box
                    p={3}
                    borderRadius={10}
                    bg={'#F3B7B7'}
                >
                    {
                        isEditComment ?
                            <EditCommentContent>
                                <Textarea
                                    fontSize='md'
                                    mb={4}
                                    resize={'none'}
                                    variant='flushed'
                                    value={messageEdited}
                                    onChange={handleOnChangeComment}
                                />
                                <Button
                                    variant={'ghost'}
                                    fontSize={12}
                                    onClick={handleUpdateComment}
                                    _hover={{
                                        bg: "#dd000020"
                                    }}
                                >
                                    Actualizar
                                </Button>
                                <Button
                                    variant={'ghost'}
                                    fontSize={12}
                                    onClick={handleIsEditComment}
                                    _hover={{
                                        bg: "#dd000020"
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </EditCommentContent>
                            :
                            <Text
                                fontSize='md'
                                mb={4}
                            >
                                {
                                    comment.edited.length > 0 ?
                                        comment.edited.sort(sortEditedMessages)[0].message.replace(regex, '@$1')
                                        :
                                        comment.message.replace(regex, '@$1')
                                }
                            </Text>
                    }
                    {
                        comment.attachs?.map((attach) => (
                            <Flex
                                alignItems={'center'}
                                gap={1}
                                key={attach.attachId}
                            >
                                <ZenTaakIcon
                                    package="githubocticonsicons"
                                    name="GoPaperclip"
                                    size={14}
                                    color={'#DD0000'}
                                />
                                <Link
                                    color={'red.200'}
                                    href={attach.fileUrl}
                                    isExternal
                                    fontWeight={'bold'}
                                >
                                    {attach.fileName}
                                </Link>
                            </Flex>
                        ))
                    }
                </Box>
            </Box>
        </HStack>
    )
}