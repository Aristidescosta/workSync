import { Avatar, Box, Text, HStack, Button, useDisclosure } from "@chakra-ui/react";
import { UserType } from "@/src/types/UserType";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { TeamType } from "@/src/types/TeamType";
import MessagePopover from "@/src/components/MessagePopover";

interface RowCardableUserTeam {
    user: UserType
    role: string | undefined
    team: TeamType | undefined
    onDeleteUser: (user: UserType) => void
}

export default function RowCardableUserTeam(props: RowCardableUserTeam): JSX.Element {

    const {
        user,
        role,
        team,
        onDeleteUser
    } = props

    const { isOpen, onToggle, onClose } = useDisclosure()

    const session = useUserSessionStore(state => state.userSession)

    function handleUserDelete() {
        onDeleteUser(user)
    }

    return (
        <HStack
            borderBottomWidth={1}
            borderColor={'gray.100'}
            py={3}
            px={5}
            justifyContent={'space-between'}
        >
            <HStack>
                <Avatar
                    name={user.session.displayName}
                    src={user.session.photoUrl as string | undefined}
                />
                <Box>
                    <Text
                        fontWeight={'bold'}
                    >
                        {user.session.displayName}
                    </Text>
                    {
                        role === "Proprietário" ?
                            <Text
                                color={'gray.400'}
                                fontSize={'sm'}
                            >
                                {role}
                            </Text>
                            :
                            <Text
                                color={'gray.400'}
                                fontSize={'sm'}
                            >
                                {`${user.session.email} • ${role}`}
                            </Text>
                    }
                </Box>
            </HStack>

            <MessagePopover
                title={`Remover ${user.session.displayName} como membro?`}
                bodyMessage={"Deseja confirmar a remoção deste membro da equipa?"}
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onToggle}
                onConfirmOperation={handleUserDelete}
                onButtonRender={() => <Box
                    cursor={'pointer'}
                >
                    {
                        team?.owner.session.id === session?.id ?
                            team?.owner.session.id === user.session.id ?
                                null
                                :
                                <Button
                                    variant='ghost'
                                    colorScheme="red"
                                    fontSize='14px'
                                >
                                    Remover
                                </Button>
                            :
                            null
                    }
                </Box>}
            />
        </HStack>
    )
}