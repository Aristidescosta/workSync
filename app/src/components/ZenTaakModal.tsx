import {
	Modal as ChakraModal,
	ModalOverlay,
	ModalContent,
	ModalProps,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
} from "@chakra-ui/react";
import { HeaderAuth } from "../pages/Authentication/components/HeaderAuth";

interface ZenTaakModal {
	title: string
	subtitle: string
	position: "absolute" | "relative"
	background?: string
	height?: number
	isLogin?: boolean
}

export const ZenTaakModal = (props: ModalProps & ZenTaakModal) => {

	const {
		title,
		subtitle,
		isOpen,
		position,
		onClose,
		size,
		background,
		height,
		children,
		isLogin
	} = props

	return (
		<ChakraModal
			{...props}
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			size={size}
			closeOnOverlayClick={false}
		>
			{
				isLogin ?
					<ModalOverlay
						bg='blackAlpha.300'
						backdropFilter='blur(10px)'
					/>
					:
					<ModalOverlay bg="blackAlpha.700" />
			}
			<ModalContent
				borderRadius="none"
				position={position}
				top={0}
				right={0}
				bg={background}
				height={height}
			>
				<ModalHeader as={'h3'}>
					<HeaderAuth
						title={title}
						subheader={subtitle}
					/>
				</ModalHeader>
				{
					!isLogin ?
						<ModalCloseButton />
						: null
				}
				<ModalBody
					py={4}
				>
					{children}
				</ModalBody>
			</ModalContent>
		</ChakraModal>
	);
};
