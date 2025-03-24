import AuthenticationPage from "@pages/Authentication/AuthenticationPage";
import { ZenTaakModal } from "@components/ZenTaakModal";
import CreateTeamPage from "./CreateTeamPage";
import CreateWorkspacePage from "./CreateWorkspacePage";
import AccountRecoveryPage from "./AccountRecoveryPage";
import { StepsAuth } from "@/src/enums/StepsAuth";
import { useUserSessionStore } from "@hooks/useUserSession";
import EmailVerificationPage from "./EmailVerificationPage";
import PackagePlanPage from "../Package/PackagePlanPage";
import { useDisclosure } from "@chakra-ui/react";
import { PlanType } from "@/src/types/PlanType";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/src/hooks/useAppStore";
import PaymentSummary from "../PaymentSummary";

interface Authentication {
	isOpen: boolean
	onClose: () => void
}
export function Authentication(props: Authentication) {

	const stepsAuth = useUserSessionStore(state => state.stepsAuth)
	const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)

	const session = useUserSessionStore(state => state.userSession)

	const onAuthClose = useAppStore(state => state.onModalClose)

	const { isOpen: isOpenResumePayment, onOpen, onClose: onCloseResumePayment } = useDisclosure()
	const navigate = useNavigate()

	const [selectedPlan, setSelectedPlan] = useState<PlanType>()
	const [typeOfPayment, setTypeOfPayment] = useState('anual')
	const [selectedMethod, setSelectedMethod] = useState('1')

	function onCloseModal() {
		props.onClose()
	}

	function onPlanSelected(plan: PlanType) {
		setSelectedPlan(plan)
		onOpen()
	}

	function handlePaymentComplete() {
		onCloseResumePayment()

		if (!session?.isEmailVerified) {
			setStepsAuth(StepsAuth.EMAIL_VERIFICATION)
		} else {
			setStepsAuth(StepsAuth.HOME)
			navigate("/home")
			onAuthClose()
		}
	}

	return (
		<>
			<ZenTaakModal
				title={
					stepsAuth === StepsAuth.PLANS ?
						"Selecione o seu plano"
						:
						stepsAuth !== StepsAuth.EMAIL_VERIFICATION ?
							"Bem-vindo ao Zen Taak"
							:
							stepsAuth !== StepsAuth.EMAIL_VERIFICATION ?
								'Recuperação de palavra-passe'
								:
								"Validação de conta"
				}
				subtitle={
					stepsAuth === StepsAuth.PLANS ?
						"Escolha o plano ideal que se enquadra aos teus objectivos"
						:
						stepsAuth !== StepsAuth.EMAIL_VERIFICATION ?
							"Faça login ou registe-se e desfrute de recursos exclusivos."
							:
							stepsAuth !== StepsAuth.EMAIL_VERIFICATION ?
								'Informe seu endereço de e-mail para redefinir a palavra-passe.'
								:
								""
				}
				isOpen={props.isOpen}
				position="relative"
				onClose={onCloseModal}
				closeOnEsc={false}
				isLogin={true}
			>
				{stepsAuth === StepsAuth.AUTHENTICATION ?
					<AuthenticationPage />
					:
					stepsAuth === StepsAuth.CREATE_PROJECT ?
						<CreateWorkspacePage />
						:
						stepsAuth === StepsAuth.EMAIL_VERIFICATION ?
							<EmailVerificationPage />
							:
							stepsAuth === StepsAuth.PLANS ?
								<PackagePlanPage
									planType="subscription"
									noHeader
									onPlanSelected={onPlanSelected}
								/>
								:
								stepsAuth === StepsAuth.ACCOUNTRECOVEVY ?
									<AccountRecoveryPage />
									:
									<CreateTeamPage
										buttonText="Seguinte"
									/>
				}
			</ZenTaakModal>
			{
				selectedPlan &&
				<PaymentSummary
					planType="subscription"
					isOpenResumePayment={isOpenResumePayment}
					expandingStorage={false}
					selectedPlan={selectedPlan}
					typeOfPayment={typeOfPayment}
					selectedMethod={selectedMethod}
					handlePaymentComplete={handlePaymentComplete}
					setTypeOfPayment={setTypeOfPayment}
					setSelectedMethod={setSelectedMethod}
					onCloseResumePayment={onCloseResumePayment}
				/>
			}
		</>
	);
}
