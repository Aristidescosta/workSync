import { ZenTaakIcon } from "@/react-icons";
import { Avatar, Box, Image, Flex, HStack, Text, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useUserSessionStore } from "@hooks/useUserSession";

interface HeaderWithoutOptions {
	onLogout: () => void
}


export default function HeaderWithoutOptions(props: HeaderWithoutOptions): JSX.Element {
    
    const {
        onLogout
    } = props

    const session = useUserSessionStore(state => state.userSession)

    return (
        <HStack
            justifyContent={'space-between'}
            px={12}
			height="80px"
			display="flex"
			background="white"
			borderBottomWidth="1px"
			borderBottomColor="#ddd"
        >
            <Image
				src="/logo.svg"
				alt="Zen Taak"
				h={10}
			/>
			<Flex alignItems="center" gap="2">
				<Flex alignItems={'center'}>
					<Menu>
						<MenuButton
							aria-label='Options'
						>
							<Avatar
								name={session?.displayName}
								src={session?.photoUrl as string | undefined}
							/>
						</MenuButton>
						<MenuList>
							<MenuItem
								icon={
									<ZenTaakIcon 
										package={"ionicons5"} 
										name={"IoLogOutOutline"}
									/>
								}	
								onClick={onLogout}
							>
								Terminar sessão
							</MenuItem>
						</MenuList>
					</Menu>
					<Box ml={3}>
						<Text fontWeight={'bold'}>
							{session?.displayName}
						</Text>
					</Box>
				</Flex>
			</Flex>
        </HStack>
    )
}