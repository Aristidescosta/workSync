import { ZenTaakIcon } from "@/react-icons";
import { TeamType } from "@/src/types/TeamType";
import { Box, VStack, Text, Image } from "@chakra-ui/react";

interface HomeTeamCard {
    type: "new" | "exist"
    title: string
    team?: TeamType
    onClick: (team?: TeamType) => void
}

export default function HomeTeamCard(props: HomeTeamCard): JSX.Element {

    const {
        type,
        title,
        team,
        onClick
    } = props

    function handleOnClick() {
        onClick(team)   
    }

    return (
        <VStack
            borderRadius={6}
            px={4}
            py={6}
            _hover={{
                borderWidth: 1,
                borderColor: 'red.100',
                cursor: 'pointer'
            }}
            onClick={handleOnClick}
        >
            <Box
                borderWidth={1}
                borderColor={'gray.500'}
                borderStyle={type == "new" ? 'dashed' : 'solid'}
                p={4}
                boxSize={28}
                borderRadius={10}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                {
                    type == "new" ?
                        <ZenTaakIcon
                            package={"githubocticonsicons"}
                            name={"GoPlus"}
                            size={40}
                            color={'#777'}
                        />
                        :
                        team?.teamImage ?
                            <Image
                                src={team.teamImage}
                                borderRadius={10}
                            />
                            :
                            <ZenTaakIcon
                                package={"githubocticonsicons"}
                                name={"GoPeople"}
                                size={40}
                                color={'#777'}
                            />
                }
            </Box>
            <Text>
                {title}
            </Text>
        </VStack>
    )
}