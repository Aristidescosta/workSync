
import { ZenTaakIcon } from "@/react-icons";

import { Avatar, Box, Text } from "@chakra-ui/react";
import { ToqueButton } from "../../components/Button";
import { InviteType } from "@/src/types/InviteType";

interface InboxItem {
	invite: InviteType
	loadingAcceptInvite: boolean
	loadingRejectInvite: boolean
	onAcceptInvite: (invite: InviteType, teamId: string, index: number) => void
	onRejectInvite: (invite: InviteType, teamId: string, index: number) => void
}

export default function InboxItem(props: InboxItem) {

	const {
		invite,
		loadingAcceptInvite,
		loadingRejectInvite,
		onAcceptInvite,
		onRejectInvite
	} = props

	async function handleAcceptInvite() {
		onAcceptInvite(invite, invite.team.teamId, 1)
	}

	function handleRejectInvite() {
		onRejectInvite(invite, invite.team.teamId, 0)
	}

	return (
		<Box
			borderBottom="1px solid #ddd"
			display="flex"
			py="20px"
			flexDir="column"
		>
			<Box display="flex" flexDir="row" alignItems="flex-start">
				<Avatar
					name={invite.team.teamName}
					src={invite.team.teamImage as string | undefined}
					size="lg"
				/>

				<Box width="90%" ml="10px">
					<Text fontWeight="bold" fontSize="18px">
						{invite.team.teamName}
					</Text>
					<Text mt="5px" fontSize="14px" lineHeight="inherit">
						Gostariamos de ter-te como colaborador na equipa {invite.team.teamName}.
					</Text>
					<Text 
						mt="5px" 
						fontSize="smaller"
						color={'gray.300'}
					>
						{`Enviado a ${invite.createdAt.convertToString()}`}
					</Text>
				</Box>
			</Box>

			<Box display="flex" justifyContent="flex-end" mt="10px">
				<ToqueButton
					variant="outline"
					size="sm"
					mt="10px"
					onClick={handleRejectInvite}
					loadingText="A rejeitar..."
					isLoading={loadingRejectInvite}
					mr="10px"
				>
					<ZenTaakIcon
						package="feather"
						name="FiXCircle"
						color="red"
						size={16}
					/>
					<Text ml="10px">Rejeitar</Text>
				</ToqueButton>

				<ToqueButton
					variant="info"
					bg={'#111'}
					size="sm"
					mt="10px"
					onClick={handleAcceptInvite}
					loadingText="A aceitar..."
					isLoading={loadingAcceptInvite}
				>
					<Text mr="10px">Aceitar</Text>
					<ZenTaakIcon
						package="feather"
						name="FiCheckCircle"
						color="#fff"
						size={16}
					/>
				</ToqueButton>
			</Box>
		</Box>
	);
}
