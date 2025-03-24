import { ZenTaakIcon } from "@/react-icons";
import { ToqueButton } from "@/src/components/Button";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { UserType } from "@/src/types/UserType";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { useState } from "react";

interface TeamItem {
	user: UserType
	sendingInvite: boolean
	onInviteSent: () => void
}

export function TeamItem(props: TeamItem) {

	const {
		user,
		sendingInvite,
		onInviteSent
	} = props

	const session = useUserSessionStore(state => state.userSession)

	async function handleSubmitInvite() {
		onInviteSent()
	}

	return (
		<Box
			borderBottom="1px solid #ddd"
			display="flex"
			alignItems="center"
			py="20px"
			w={'100%'}
		>
			<Avatar
				name={user.session.displayName}
				src={user.session.photoUrl as string | undefined}
				size="md"
			/>

			<Box width="90%" ml="10px">
				<Text fontWeight="bold">{user.session.displayName}</Text>
				<Text>{user.session.email}</Text>
			</Box>

			{
				session?.email === user.session.email ?
					null
					:
					<ToqueButton
						variant="info"
						size="md"
						onClick={handleSubmitInvite}
						isLoading={sendingInvite}
						bg={'red.100'}
					>
						<Text mr="10px">Enviar</Text>
						<ZenTaakIcon package="feather" name="FiSend" color="#fff" size={30} />
					</ToqueButton>
			}
		</Box>
	);
}
