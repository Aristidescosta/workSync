import { ZenTaakIcon } from "@/react-icons";
import TagsSelected from "@/src/components/TagsSelected";
import { useTaskStore } from "@/src/hooks/useTask";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import generateId from "@/src/services/UUID";
import { TagType } from "@/src/types/TagType";
import { zenTaakTags } from "@/src/utils/helpers";
import { Box, HStack, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";


interface LabelMenuRow {
    tag: TagType
    onTagSelected: (tag: TagType) => void
}

interface TaskLabel {
    selectedTags: (tags: TagType[]) => void
    existingTags: TagType[]
}

export default function TaskLabel(props: TaskLabel): JSX.Element {

    const [tags, setTags] = useState<TagType[]>(props.existingTags)

    const user = useUserSessionStore(state => state.user)

    const saveLogs = useTaskStore(state => state.saveLogs);

    useEffect(() => {
        props.selectedTags(tags)
    }, [tags.length])

    function onTagSelected(tag: TagType) {
        if (user) {
            setTags(state => {

                if (state.some(t => t.tag === tag.tag)) {

                    saveLogs({
                        logId: generateId(),
                        action: "removeu",
                        createAt: new Date(),
                        data: `a etiqueta ${tag.tag}`,
                        icon: "GoTag",
                        user
                    })

                    return state.filter(t => t.tag !== tag.tag)
                }

                saveLogs({
                    logId: generateId(),
                    action: "adicionou",
                    createAt: new Date(),
                    data: `a etiqueta ${tag.tag}`,
                    icon: "GoTag",
                    user
                })

                return [...state, tag]
            })
        }
    }

    return (
        <Box
            borderTopWidth={0.1}
            borderBottomWidth={0.1}
            borderColor={'gray.100'}
            py={3}
        >
            <HStack
                justifyContent={'space-between'}
            >
                {
                    tags.length > 0 ?
                        <TagsSelected
                            tags={tags}
                        />
                        :
                        <Text
                            fontSize={'smaller'}
                            color={'gray.300'}
                        >
                            Sem etiqueta
                        </Text>

                }
                <Menu closeOnSelect={false}>
                    <MenuButton
                        as={IconButton}
                        icon={
                            <Box
                                padding={1}
                                cursor={'pointer'}
                                _active={{
                                    opacity: 0.5
                                }}
                            >
                                <ZenTaakIcon
                                    package={"feather"}
                                    name={"FiPlus"}
                                    size={20}
                                    color="#666"
                                />
                            </Box>
                        }
                        variant='unstyled'
                    />
                    <MenuList>
                        <MenuOptionGroup type="checkbox" value={tags.map(tag => tag.tag)}>
                            {
                                zenTaakTags.map((tag, index) => (
                                    <MenuItemOption value={tag.tag} key={index}>
                                        <LabelMenuRow
                                            tag={tag}
                                            onTagSelected={onTagSelected}
                                        />
                                    </MenuItemOption>
                                ))
                            }
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            </HStack>
        </Box>
    )
}



export function LabelMenuRow(props: LabelMenuRow): JSX.Element {
    const {
        tag,
        onTagSelected
    } = props

    function handleTagSelected() {
        onTagSelected(tag)
    }

    return (
        <Box
            onClick={handleTagSelected}
        >
            <HStack>
                <Box
                    boxSize={4}
                    borderRadius={100}
                    bg={tag.color}
                />
                <Text>
                    {tag.tag}
                </Text>
            </HStack>
            <Text
                fontSize={'small'}
                color={'gray.300'}
            >
                {tag.description}
            </Text>
        </Box>
    )
}