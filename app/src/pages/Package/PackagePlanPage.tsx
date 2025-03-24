import { Text, Heading, VStack, Flex, Spinner } from "@chakra-ui/react";
import Package from "./Package";
import { usePlan } from "@/src/hooks/usePlanStore";
import { useState } from "react";
import { PlanType, StoragePlanType } from "@/src/types/PlanType";
import { ToqueButton } from "@/src/components/Button";
import { StepsAuth } from "@/src/enums/StepsAuth";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/src/hooks/useAppStore";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useSubscriptionStore } from "@/src/hooks/useSubscription";

interface PackagePlanPage {
    noHeader: boolean
    planType: "subscription" | "storage" | "notification",
    onPlanSelected: (plan: PlanType) => void
    onClose?: () => void
}

export default function PackagePlanPage(props: PackagePlanPage): JSX.Element {

    const {
        noHeader,
        planType,
        onPlanSelected
    } = props

    const [planSelected, setPlanSelected] = useState<PlanType>()
    const [loadingSubscribe, setLoadingSubscribe] = useState<boolean>(false)

    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)
    const session = useUserSessionStore(state => state.userSession)

    const onAuthClose = useAppStore(state => state.onModalClose)

    const createSubscription = useSubscriptionStore(state => state.createSubscription)
    const subscription = useSubscriptionStore(state => state.subscription)

    const navigate = useNavigate()

    const plans = usePlan(state => state.plans)
    const loadingPlans = usePlan(state => state.loadingPlans)


    function handlePlanSelected(plan: PlanType) {
        setPlanSelected(plan)
    }

    async function handleWithChoosedPlan() {
        setLoadingSubscribe(true)
        if (planSelected?.anualPrice === undefined) {
            if (session && planSelected) {
                await createSubscription(session.id, planSelected, "Startups (Grátis)", "subscription")
            }

            if (!session?.isEmailVerified) {
                setStepsAuth(StepsAuth.EMAIL_VERIFICATION)
            } else {
                setStepsAuth(StepsAuth.HOME)
                navigate("/home")
                onAuthClose()
            }
        } else {
            onPlanSelected(planSelected)
        }

        setLoadingSubscribe(false)
    }

    console.log(plans)

    return (
        <VStack>
            {
                noHeader ? null :
                    <Heading>
                        Selecione o seu plano
                    </Heading>
            }
            {
                loadingPlans ?
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='red.100'
                        color='red.200'
                        size='xl'
                    /> : null
            }
            {
                plans.filter(p => p.type === planType).map((plan) => (
                    <Package
                        key={plan.planId}
                        plan={plan}
                        currentPlan={subscription?.package}
                        selected={planSelected === plan}
                        onSelected={handlePlanSelected}
                    />
                ))
            }
            <ToqueButton
                mt={2}
                w='100%'
                variant={"primary"}
                /* isDisabled={planSelected === undefined} */
                isLoading={loadingSubscribe}
                onClick={handleWithChoosedPlan}
            >
                <Text
                    fontSize='14'
                    alignSelf={'center'}
                >
                    {`Continuar ${planSelected ? "com Plano " + planSelected.planName : ""}`}
                </Text>
            </ToqueButton>
            {
                planType === "subscription" ?
                    <Flex
                        justifyContent={'flex-end'}
                        w={'full'}
                    >
                        <Text
                            fontSize={11}
                            color={'red.200'}
                        >
                            *Armazenamento expansível
                        </Text>
                    </Flex> : null
            }
        </VStack>
    )
}