import { ZenTaakIcon } from "@/react-icons";
import { TagType } from "@/src/types/TagType";
import { StateTask, TaskType } from "@/src/types/TaskType";
import { zenTaakTags } from "@/src/utils/helpers";
import { Box, Card, CardHeader, Flex, HStack, Heading, MenuItemOption, MenuOptionGroup, Text } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { UserType } from "@/src/types/UserType";
import { useTeamStore } from "@/src/hooks/useTeam";
import MenuFilter from "./MenuFilter";


interface ListTaskHeader {
    tasks: TaskType[]
    state: StateTask
    tags: TagType[]
    member?: UserType
    onRender: (task: TaskType, index: number) => ReactNode
    onTagSelected: (tag?: TagType) => void
    onStateSelected: (state: StateTask) => void;
    onMemberSelected: (member?: UserType) => void
    clearTagFilter: () => void
    clearMemberFilter: () => void
}

interface TagsMenu {
    tag: TagType
    onTagSelected: (tag?: TagType) => void
}

interface StatesMenu {
    state: StateTask
    onStateSelected: (state: StateTask) => void;
}

interface MembersMenu {
    member: UserType
    onMemberSelected: (member?: UserType) => void;
}
export default function ListCardableTask(props: ListTaskHeader): JSX.Element {

    const membersOfTeam = useTeamStore(state => state.membersOfTeam)
    const [members, setMembers] = useState<UserType[]>([])

    const width = window.innerWidth
    const stateEnumArray: StateTask[] = ["Concluída", "Em andamento", "Em revisão", "Incompleta", "Não iniciada"];

    const {
        tasks,
        state,
        tags,
        member,
        onRender,
        onTagSelected,
        onStateSelected,
        onMemberSelected,
        clearTagFilter,
        clearMemberFilter
    } = props

    useEffect(() => {
        const users: UserType[] = []

        for (const user of membersOfTeam) {
            users.push({
                session: user.value,
                teams: [],
                memberOfTeams: [],
                createdAt: new Date()
            })
        }
        setMembers(users)

    }, [membersOfTeam])

    function clearStateFilter() {
        onStateSelected("Não iniciada")
    }

    function handleChangeState() {
        if (state === stateEnumArray[0]) {
            onStateSelected("Não iniciada")
        } else {
            onStateSelected(stateEnumArray[0])
        }
    }

    return (
        <Flex
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
                    <HStack
                        justifyContent={'space-between'}
                    >
                        <Flex
                            gap={10}
                        >
                            <Flex
                                alignItems={'center'}
                                gap={2}
                                onClick={handleChangeState}
                                cursor={'pointer'}
                            >
                                <ZenTaakIcon
                                    package={"fontawesome6"}
                                    name={"FaInbox"}
                                    size={14}
                                />

                                <Text
                                    fontWeight={state !== stateEnumArray[0] ? '500' : 400}
                                >
                                    Abertas
                                </Text>
                            </Flex>
                            <Flex
                                alignItems={'center'}
                                gap={2}
                                onClick={handleChangeState}
                                cursor={'pointer'}
                            >
                                <ZenTaakIcon
                                    package={"githubocticonsicons"}
                                    name={"GoCheckCircleFill"}
                                    size={16}
                                />
                                <Text
                                    fontWeight={state === stateEnumArray[0] ? '500' : 400}
                                >
                                    Fechadas
                                </Text>
                            </Flex>

                        </Flex>

                        <Flex
                            gap={10}
                        >
                            <MenuFilter
                                title={"Etiqueta"}
                                handleClear={clearTagFilter}
                                children={
                                    <MenuOptionGroup type='checkbox' value={tags.map(tag => tag.tag)}>
                                        {zenTaakTags.map((tag, index) => (
                                            <MenuItemOption value={tag.tag} key={index} >
                                                <MenuTags
                                                    tag={tag}
                                                    onTagSelected={onTagSelected}
                                                />
                                            </MenuItemOption>
                                        ))
                                        }
                                    </MenuOptionGroup>
                                }
                            />

                            <MenuFilter
                                title={"Atribuído"}
                                handleClear={clearMemberFilter}
                                children={
                                    <MenuOptionGroup type='checkbox'  value={member ? member.session.displayName : ""}>
                                        {members.map((member, index) => (
                                            <MenuItemOption value={member.session.displayName} key={index}>
                                                <MembersMenu
                                                    member={member}
                                                    onMemberSelected={onMemberSelected}
                                                />
                                            </MenuItemOption>
                                        ))
                                        }
                                    </MenuOptionGroup>
                                }
                            />

                            <MenuFilter
                                title={"Estado"}
                                handleClear={clearStateFilter}
                                children={
                                    <MenuOptionGroup type='checkbox' value={state}>
                                        {stateEnumArray.map((state, index) => (
                                            <MenuItemOption value={state} key={index}>
                                                <StatesMenu
                                                    state={state}
                                                    onStateSelected={onStateSelected}
                                                />
                                            </MenuItemOption>
                                        ))
                                        }
                                    </MenuOptionGroup>
                                }
                            />
                        </Flex>
                    </HStack>
                </CardHeader>
                {
                    tasks.length !== 0 ?
                        tasks.map(onRender)
                        :
                        <Box
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                            height="50vh"
                        >
                            <Heading>Nenhuma tarefa registada</Heading>
                        </Box>
                }
            </Card>
        </Flex>
    )
}

function MenuTags(props: TagsMenu): JSX.Element {
    const {
        tag,
        onTagSelected
    } = props

    function handleStateSelected() {
        onTagSelected(tag)
    }

    return (
        <Box
            onClick={handleStateSelected}
        >
            <Text
                fontSize={'small'}
                color={'black.300'}
            >
                {tag.tag}
            </Text>
        </Box>
    )
}

function StatesMenu(props: StatesMenu): JSX.Element {

    const {
        state,
        onStateSelected
    } = props

    function handleStateSelected() {
        onStateSelected(state)
    }

    return (
        <Box
            onClick={handleStateSelected}
        >
            <Text
                fontSize={'small'}
                color={'black.300'}
            >
                {state}
            </Text>
        </Box>
    )
}

function MembersMenu(props: MembersMenu): JSX.Element {

    const {
        member,
        onMemberSelected
    } = props

    function handleUserSelected() {
        onMemberSelected(member)
    }

    return (
        <Box
            onClick={handleUserSelected}
        >
            <Text
                fontSize={'small'}
                color={'black.300'}
            >
                {member.session.displayName}
            </Text>
        </Box>
    )
}