import { ZenTaakIcon } from "@/react-icons";
import { Box, Heading } from "@chakra-ui/react";

type Props = {
	title: string;
	bg?: string;
	closeModal: () => void;
};

export function HeaderModal({ title, bg, closeModal }: Props) {
	return (
		<Box
			display="flex"
			borderBottom="1px solid #ddd"
			p="7"
			justifyContent="space-between"
			alignItems="center"
			bg={bg}
		>
			<Heading as="h3" fontSize="28px">
				{title}
			</Heading>

			<Box
				display="flex"
				justifyContent="flex-end"
				cursor="pointer"
				onClick={closeModal}
			>
				<ZenTaakIcon package="feather" name="FiX" />
			</Box>
		</Box>
	);
}
