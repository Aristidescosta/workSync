import { ChakraBaseProvider } from "@chakra-ui/react";

import RoutesConfig from "@routes/RoutesConfig"

import { ZenTaakTheme, theme } from "@/src/services/chakra-ui-api/ZenTaakTheme";
import { useEffect } from "react";
import { useUserSessionStore } from "./hooks/useUserSession";
import { useSubscriptionStore } from "./hooks/useSubscription";
import ReactTourProvider, { steps } from "@/Reactour-tour";

export default function App() {

	const session = useUserSessionStore(state => state.userSession)
	const authenticationListener = useUserSessionStore(state => state.authenticationListener)

	const observingSubscription = useSubscriptionStore(state => state.observingSubscription)

	useEffect(() => {

		const unsubscribe = authenticationListener(user => {

		})

		return () => {
			unsubscribe()
		}
	}, [])

	useEffect(() => {

		if (session) {
			const planSubscribe = observingSubscription(session.id, "subscription")
			return () => {
				planSubscribe()
			}
		}
	}, [session])

	return (
		<ChakraBaseProvider theme={ZenTaakTheme}>
			<ReactTourProvider
				steps={steps}
				badgeContent={({ totalSteps, currentStep }) => currentStep + 1 + "/" + totalSteps}
				styles={{
					popover: (base) => ({
						...base,
						'--reactour-accent': '#dd0000',
						borderRadius: 10,
					}),
					maskArea: (base) => ({ ...base, rx: 10 }),
					maskWrapper: (base) => ({ ...base, color: '#555' }),
					badge: (base) => ({ ...base, left: 'auto', right: '-0.8125em' }),
					controls: (base) => ({ ...base, marginTop: 20 }),
					close: (base) => ({ ...base, right: 'auto', left: 8, top: 8 }),
				}}
			>
				<RoutesConfig />
			</ReactTourProvider>
		</ChakraBaseProvider>
	);
}
