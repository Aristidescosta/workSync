import { useEffect } from "react";
import HeaderWithoutOptions from "@/src/components/HeaderWithoutOptions";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { VStack, Box, Flex, Text, HStack, Divider, Stack, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HomeTeamCard from "./components/TeamCardAddNew";
import { useTeamStore } from "@/src/hooks/useTeam";
import { TeamType } from "@/src/types/TeamType";
import CreateTeamPage from "../Authentication/CreateTeamPage";
import { ZenTaakModal } from "@/src/components/ZenTaakModal";
import { useAppStore } from "@/src/hooks/useAppStore";
import { Authentication } from "../Authentication";
import { useSubscriptionStore } from "@/src/hooks/useSubscription";
import { ZenTaakPlanType } from "@/src/types/PlanType";
import { usePlan } from "@/src/hooks/usePlanStore";

export default function HomeManageTeamPage(): JSX.Element {

    const { isOpen: isOpenCreateTeam, onOpen: onOpenCreateTeam, onClose: onCloseCreateTeam } = useDisclosure()
    const user = useUserSessionStore(state => state.user)
    const logout = useUserSessionStore(state => state.logout)
    const observingUserData = useUserSessionStore(state => state.observingUserData)

    const session = useUserSessionStore(state => state.userSession)

    const subscription = useSubscriptionStore(state => state.subscription)

    const getAllPlans = usePlan(state => state.getAllPlans)

    const openAuthOpen = useAppStore(state => state.onModalOpen)
    const isAuthOpen = useAppStore(state => state.isModalOpen)
    const onAuthClose = useAppStore(state => state.onModalClose)

    const teams = useTeamStore(state => state.teams)
    console.log("MINHAS EQUIPAS: ", teams)
    const updateCurrentTeam = useTeamStore(state => state.updateCurrentTeam)

    const creatingTeam = {
        get conditionalForCreateTeams(): boolean | undefined {
            return subscription?.expiration && ((subscription.package as ZenTaakPlanType)?.feature.teamNumber === 0 ||
                (subscription.package as ZenTaakPlanType)?.feature.teamNumber > teams.length)
        },
        get teamNumber(): number {
            return (subscription?.package as ZenTaakPlanType)?.feature.teamNumber === 0 ?
                1000000000000000000000000000000000
                :
                (subscription?.package as ZenTaakPlanType)?.feature.teamNumber + 1
        }
    }

    const navigate = useNavigate();

	useEffect(() => {
        getAllPlans()
	}, [])

    useEffect(() => {
        if (!session) {
            openAuthOpen()
        }

        if (session) {
            const userSubscribe = observingUserData(session.id)
            return () => {
                userSubscribe()
            }
        }

    }, [session])

    async function handleLogout() {
        await logout()
        //window.location.href = "https://zentaak.com/"
    }

    function handleOnNavigateToTeam(team?: TeamType) {
        if (team) {
            updateCurrentTeam(team)
            navigate(`/home/${team.teamId}`)
        } else {
            navigate("/home")
        }
    }

    return (
        <Box>
            <HeaderWithoutOptions
                onLogout={handleLogout}
            />

            <Authentication
                isOpen={isAuthOpen}
                onClose={onAuthClose}
            />

            <Stack
                h={'90vh'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Flex
                    alignItems={'center'}
                    justifyContent={'space-around'}
                    gap={10}
                >
                    <VStack>
                        <Text
                            fontSize={'large'}
                            fontWeight={'500'}
                        >
                            Minhas equipas
                        </Text>
                        <HStack gap={1}>
                            {/* {
                                creatingTeam.conditionalForCreateTeams ?
                                    <HomeTeamCard
                                        type="new"
                                        title={"Nova equipa"}
                                        onClick={onOpenCreateTeam}
                                    />
                                    :
                                    null
                            } */}
                            <HomeTeamCard
                                        type="new"
                                        title={"Nova equipa"}
                                        onClick={onOpenCreateTeam}
                                    />
                            {
                                teams/* .slice(0, creatingTeam.teamNumber) */
                                    .filter(t => t.owner.session.id === user?.session.id).map((team, index) => (
                                        <HomeTeamCard
                                            key={index}
                                            type="exist"
                                            title={team.teamName}
                                            team={team}
                                            onClick={handleOnNavigateToTeam}
                                        />
                                    ))
                            }
                        </HStack>
                    </VStack>
                    {
                        user?.memberOfTeams.length === 0 ? null : (
                            <>
                                <Divider
                                    orientation="vertical"
                                    height={40}
                                />
                                <VStack>
                                    <Text
                                        fontSize={'large'}
                                        fontWeight={'500'}
                                    >
                                        Outras equipas
                                    </Text>
                                    <HStack gap={1}>
                                        {
                                            user?.memberOfTeams.map((team, index) => (
                                                <HomeTeamCard
                                                    key={index}
                                                    type="exist"
                                                    title={team.teamName}
                                                    team={team}
                                                    onClick={handleOnNavigateToTeam}
                                                />
                                            ))
                                        }
                                    </HStack>
                                </VStack>
                            </>
                        )
                    }
                </Flex>
            </Stack>
            <ZenTaakModal
                isOpen={isOpenCreateTeam}
                title={"Criar nova equipa"}
                subtitle={"Com uma ou mais equipas criadas, você será capaz de gerir os projectos e os colaboradores do mesmo."}
                onClose={onCloseCreateTeam}
                position={"relative"}
            >
                <CreateTeamPage
                    buttonText="Criar equipa"
                    onCreateTeam={onCloseCreateTeam}
                />
            </ZenTaakModal>
        </Box>
    )
}