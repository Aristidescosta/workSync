import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, HStack, Text, Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { NotificationType, NotifyType } from "../types/NotificationType";
import { ZenTaakIcon } from "@/react-icons";

interface NotificationPopover {
    notifications: NotificationType[]
    onNotificationRead: (notification: NotificationType, type: NotifyType) => void
    onButtonRender: () => ReactNode
}

export default function NotificationPopover(props: NotificationPopover): JSX.Element {

    const {
        notifications,
        onNotificationRead,
        onButtonRender
    } = props

    function handleNotificationRead(notification: NotificationType) {
        onNotificationRead(notification, notification.type)
    }

    return (
        <Popover
            variant="rounded"
        >
            <PopoverTrigger>
                {onButtonRender()}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverHeader
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Text
                        fontWeight={'500'}
                        fontSize={18}
                    >
                        Notificações
                    </Text>
                    <Text
                        color={'gray.400'}
                    >
                        {notifications.filter(n => n.read !== true ).length}
                    </Text>
                </PopoverHeader>
                <PopoverBody p={0}>
                    {
                        notifications.length === 0 ?
                            <Text
                                fontSize={13}
                                p={2}
                                textAlign={'center'}
                            >
                                Sem notificações!
                            </Text>
                            :
                            notifications.map((notification) => (
                                <HStack
                                    key={notification.notificationId}
                                    p={3}
                                    borderBottomWidth={0.5}
                                    borderBottomColor={'gray.100'}
                                    cursor={'pointer'}
                                    borderLeftWidth={notification.read ? 0 : 4}
                                    borderLeftColor={'red.100'}
                                    borderBottomLeftRadius={4}
                                    onClick={() => handleNotificationRead(notification)}
                                >
                                    <Flex
                                        borderRightWidth={1}
                                        borderRightColor={'gray.100'}
                                        h={10}
                                        pr={2}
                                        alignItems={'center'}
                                    >
                                        <ZenTaakIcon
                                            package="githubocticonsicons"
                                            name={notification.type === "comment" ? "GoComment" : notification.type === "task" ? "GoTasklist" : notification.type === "storage" ? "GoBellFill" : notification.type === "mention" ? "GoMention" : "GoCreditCard"}
                                            size={20}
                                        />
                                    </Flex>
                                    <Box>
                                        <Text 
                                            fontSize={12}
                                            fontWeight={'500'}
                                        >
                                            {notification.title}
                                        </Text>
                                        <Text noOfLines={1} fontSize={13}>{notification.body}</Text>
                                        <Text fontSize={10}>{notification.createAt.convertToString().toLocaleUpperCase()}</Text>
                                    </Box>
                                </HStack>
                            ))
                    }
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}