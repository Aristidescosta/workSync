import { Divider, Flex, Text } from "@chakra-ui/react";

export default function DividerAuth() {
	return (
		<Flex mt="22px" w="100%" alignItems="center">
			<Divider
				orientation="horizontal"
				borderBottom="1px"
				borderBottomColor="#ddd"
			/>
			<Text ml="3" mr="3" fontSize={13}>
				Ou
			</Text>
			<Divider
				orientation="horizontal"
				borderBottom="1px"
				borderBottomColor="#ddd"
			/>
		</Flex>
	);
}
