import ZenTaakDrawer from "@/src/components/ZenTaakDrawer";
import InboxItem from "./InboxItem";
import { useInviteUserStore } from "@/src/hooks/useInviteUser";
import { useEffect, useState } from "react";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { InviteType } from "@/src/types/InviteType";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { useTeamStore } from "@/src/hooks/useTeam";
import { VStack, Text } from "@chakra-ui/react";

interface InboxPage extends iModalPage { }

export default function InboxPage(props: InboxPage): JSX.Element {

    const {
        isOpen,
        onClose
    } = props

    const [invites, setInvites] = useState<InviteType[]>([])
    const [inviteSelected, setInviteSelected] = useState<InviteType>()
    const [loadingReject, setLoadingReject] = useState(false);
    const [loadingAccept, setLoadingAccept] = useState(false);

    const { toastMessage, ToastStatus } = useToastMessage()

    const session = useUserSessionStore(state => state.userSession)
    const user = useUserSessionStore(state => state.user)

    const getAllUserInvitation = useInviteUserStore(state => state.getAllUserInvitation)
    const acceptOrRejectInvite = useInviteUserStore(state => state.acceptOrRejectInvite)

    const addMemberToTeam = useTeamStore(state => state.addMemberToTeam)

    useEffect(() => {

        if (session) {
            const unsubscribe = getAllUserInvitation(session.email, (invite, isRemoving) => {
                setInvites(state => {

                    if (isRemoving) {
                        const allInvites = state.filter(i => i.id !== invite.id)
                        return allInvites
                    }

                    return [...state, invite]
                })
            })
            return () => unsubscribe()
        }

    }, [session])

    function handleAcceptAndRejectInvite(invite: InviteType, teamId: string, index: number) {
        setInviteSelected(invite)
        if (session) {
            if (index) {
                setLoadingAccept(true)
            } else {
                setLoadingReject(true)
            }

            acceptOrRejectInvite(invite, session.id, index === 1)
                .then(() => {
                    if (index && user) {
                        addMemberToTeam(user, teamId)
                            .then(() => {
                                setLoadingAccept(false)
                                onClose()
                            })
                            .catch(error => {
                                setLoadingAccept(false)
                                setLoadingReject(false)
                                toastMessage({
                                    title: "Adicionar colaborador",
                                    description: error,
                                    statusToast: ToastStatus.WARNING,
                                    position: "bottom"
                                })
                            })
                    } else {
                        setLoadingReject(false)
                    }
                    setInviteSelected(undefined)
                })
                .catch(error => {
                    setInviteSelected(undefined)
                    setLoadingAccept(false)
                    setLoadingReject(false)
                    toastMessage({
                        title: "Convidar colaborador",
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom"
                    })
                })
        }

    }

    return (
        <ZenTaakDrawer
            title="Caixa de entrada"
            size={"md"}
            isOpen={isOpen}
            onClose={onClose}
        >
            {
                invites.length === 0 ?
                    <VStack
                        height={'full'}
                        justifyContent={'center'}
                    >
                        <Text
                            fontWeight={'bold'}
                            color={'gray.300'}
                        >
                            Sem mensagens
                        </Text>
                    </VStack>
                    :
                    invites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((invite, index) => (
                        <InboxItem
                            key={index}
                            invite={invite}
                            loadingAcceptInvite={inviteSelected?.id === invite.id ? loadingAccept : false}
                            loadingRejectInvite={inviteSelected?.id === invite.id ? loadingReject : false}
                            onAcceptInvite={handleAcceptAndRejectInvite}
                            onRejectInvite={handleAcceptAndRejectInvite}
                        />
                    ))
            }
        </ZenTaakDrawer>
    )
}