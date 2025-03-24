import { UserType } from "@/src/types/UserType";
import { Card, CardHeader, Flex, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";


interface ListCardableUsersTeam {
    users: UserType[]
    onRender: (user: UserType, index: number) => ReactNode
}

export default function ListCardableUsersTeam(props: ListCardableUsersTeam): JSX.Element {

    const {
        users,
        onRender
    } = props

    return (
        <Flex
            justifyContent={'center'}
            py={2}
            pl={10}
        >
            <Card
               width={'full'}
            >
                <CardHeader
                    borderBottomWidth={1}
                    borderColor={'gray.100'}
                    bg={'#fafafa'}
                >
                    <Heading fontWeight={'400'} size='md'>Membros da equipa</Heading>
                </CardHeader>
                {users.map(onRender)}
            </Card>
        </Flex>
    )
}