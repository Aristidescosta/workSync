import { Modal, ModalOverlay, ModalContent, ModalBody, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";
import { TabConfirmPayment } from "./TabConfirmPayment";
import { TabPaymentSummary } from "./TabPaymentSummary";
import { useState } from "react";
import { PlanType } from "@/src/types/PlanType";

interface PaymentSummary {
    isOpenResumePayment: boolean
    selectedPlan: PlanType
    typeOfPayment: string
    selectedMethod: string
    expandingStorage: boolean
    planType: "subscription" | "storage" | "notification",
    handlePaymentComplete: () => void
    setTypeOfPayment: (value: string) => void
    setSelectedMethod: (value: string) => void
    onCloseResumePayment: () => void
}

export default function PaymentSummary(props: PaymentSummary): JSX.Element {

    const [tabIndex, setTabIndex] = useState<number>(0)

    const {
        isOpenResumePayment,
        selectedPlan,
        selectedMethod,
        typeOfPayment,
        planType,
        expandingStorage,
        handlePaymentComplete,
        setTypeOfPayment,
        setSelectedMethod,
        onCloseResumePayment
    } = props

    function handleClose() {
        setTabIndex(0)
        onCloseResumePayment()
    }

    function handleTabsChange(index: number) {
		setTabIndex(index)
	}

    return (
        <Modal
            isOpen={isOpenResumePayment}
            onClose={onCloseResumePayment}
            size={'2xl'}
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <Tabs index={tabIndex} onChange={handleTabsChange}>
                        <TabPanels>
                            <TabPanel>
                                <TabPaymentSummary
                                    planType={planType}
                                    expandingStorage={expandingStorage}
                                    onClose={handleClose}
                                    planSelected={selectedPlan}
                                    setTabIndex={setTabIndex}
                                    setTypeOfPayment={setTypeOfPayment}
                                    typeOfPayment={typeOfPayment}
                                    setSelectedMethod={setSelectedMethod}
                                    selectedMethod={selectedMethod}
                                />
                            </TabPanel>
                            <TabPanel>
                                <TabConfirmPayment
                                    description="Abra a sua aplicação do E-Kwanza e pague por Referência ou por Código QR"
                                    planSelected={selectedPlan}
                                    typeOfPayment={typeOfPayment}
                                    selectedMethod={selectedMethod}
                                    planType={planType}
                                    onClose={handleClose}
                                    setTabIndex={setTabIndex}
                                    onPaymentComplete={handlePaymentComplete}
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>

        </Modal>
    )
}