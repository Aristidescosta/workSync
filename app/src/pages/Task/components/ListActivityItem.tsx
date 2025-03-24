import { ZenTaakIcon } from "@/react-icons";
import { ActivityType } from "@/src/types/ActivityType";
import { Card, HStack, Flex, Text, Box, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ListActivityItem {
    activity: ActivityType
    editingActivity: ActivityType | null
    onDelete: (id: string) => void
    onEdit: (activity: ActivityType) => void
    updateList: (activity: ActivityType) => void
    setEditing: (isEditing: boolean) => void
}

export default function ListActivityItem(props: ListActivityItem): JSX.Element {

    const [activityForEdit, setActivityForEdit] = useState<string>("")
    const [isEditting, setIsEditting] = useState<boolean>(false)

    const {
        activity,
        editingActivity,
        onDelete,
        onEdit,
        updateList,
        setEditing
    } = props

    useEffect(() => {
        setEditing(isEditting)
    }, [isEditting])

    function handleOnDelete() {
        onDelete(activity.activityId)
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setActivityForEdit(event.target.value)
    }

    function handleOnEdit() {
        setIsEditting(true)
        setActivityForEdit(activity.activity)
        onEdit(activity)
    }

    function uprdateActivitiesList() {
        const newActivity: ActivityType = {
            activityId: editingActivity?.activityId as string,
            activity: activityForEdit,
            createdAt: editingActivity?.createdAt as Date,
            isDone: editingActivity?.isDone as boolean
        }
        updateList(newActivity)
        setIsEditting(!isEditting)
    }

    return (
        <Card
            bg={'#fafafa'}
            py={3}
            px={4}
            my={4}
        >
            {isEditting && editingActivity?.activityId === activity.activityId ?
                <HStack
                    justifyContent={'space-between'}
                >
                    <Flex
                        gap={1}
                        flexGrow={1}
                    >
                        <Input
                            height="30px"
                            fontSize={16}
                            color={"#555"}
                            variant={"unstyled"}
                            onChange={handleInputChange}
                            value={activityForEdit}
                            placeholder="Adicione uma actividade e pressione a tecla enter"
                            _placeholder={{ fontSize: 15, color: "#555", opacity: 0.8 }}
                        />
                        <Box
                            cursor={'pointer'}
                            onClick={uprdateActivitiesList}
                        >
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoCheck"
                                size={24}
                                color="#555"
                            />
                        </Box>
                    </Flex>
                </HStack>
                :
                <HStack
                    justifyContent={'space-between'}
                >
                    <Flex
                        gap={1}
                        flexGrow={1}
                    >
                        <ZenTaakIcon
                            package="githubocticonsicons"
                            name="GoChecklist"
                            size={24}
                            color="#555"
                        />
                        <Text
                            width={'80%'}
                            noOfLines={3}
                        >
                            {activity.activity}
                        </Text>
                    </Flex>
                    <Flex
                        gap={6}
                    >
                        <Box
                            cursor={'pointer'}
                            onClick={handleOnEdit}
                        >
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoPencil"
                                size={20}
                                color="#555"
                            />
                        </Box>

                        <Box
                            cursor={'pointer'}
                            onClick={handleOnDelete}
                        >
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoTrash"
                                size={20}
                                color="#ff2a00"
                            />
                        </Box>
                    </Flex>
                </HStack>
            }
        </Card>
    )
}