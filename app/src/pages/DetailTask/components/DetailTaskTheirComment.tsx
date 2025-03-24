import { CommentType } from "@/src/types/CommentType";
import { sortEditedMessages } from "@/src/utils/helpers";
import { Avatar, Box, Button, Flex, HStack, Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";
import DetailTaskCommentHistory from "./DetailTaskCommentHistory";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { ZenTaakIcon } from "@/react-icons";

interface DetailTaskComment {
    comment: CommentType
}

const regex = /\@\[([^\]]+)\]/g

export default function DetailTaskTheirComment(props: DetailTaskComment): JSX.Element {

    const {
        comment
    } = props

    const [refresh, setRefresh] = useState<number>(Date.now())

    useEffect(() => {
        if (comment.edited.length > 0) {
            comment.edited.push({
                message: comment.message,
                updatedAt: Timestamp.fromDate(comment.createdAt)
            })
        }
    }, [])

    useEffect(() => {}, [refresh])

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
                </HStack>
                <Box>
                    <Text
                        fontSize='md'
                    >
                        {
                            comment.edited.length > 0 ?
                                comment.edited.sort(sortEditedMessages)[0].message.replace(regex, '@$1')
                                :
                                comment.message.replace(regex, '@$1')
                        }
                    </Text>
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