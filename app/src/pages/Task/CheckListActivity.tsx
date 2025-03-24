import { ZenTaakIcon } from "@/react-icons";
import { Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import ListActivityItem from "./components/ListActivityItem";
import { useEffect, useState } from "react";
import { ActivityType } from "@/src/types/ActivityType";
import generateId from "@/src/services/UUID";

interface CheckListActivity {
    onActivitiesAdded: (activities: ActivityType[]) => void
    existingActivities: ActivityType[]
    setEditting: (isEditing: boolean) => void
}

export default function CheckListActivity(props: CheckListActivity): JSX.Element {

    const {
        onActivitiesAdded,
        existingActivities,
        setEditting
    } = props

    const [activity, setActivity] = useState<string>("")
    const [activities, setActivities] = useState<ActivityType[]>(existingActivities)
    const [edittingActivity, setEdittingActivity] = useState<ActivityType | null>(null);

    useEffect(() => {
        onActivitiesAdded(activities)
    }, [activities])

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            if (activity.trim() !== "") {
                const newActivity: ActivityType = {
                    activityId: generateId(),
                    activity,
                    createdAt: new Date(),
                    isDone: false
                }

                setActivities(state => [...state, newActivity])
                setActivity("")
            }
        }
    }    

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setActivity(e.target.value)
    }

    function handleOnDeleteActivity(id: string) {
        setActivities(state => state.filter(a => a.activityId !== id))
    }

    function handleOnEditActivity(activity: ActivityType) {
        setEdittingActivity(activity)
    }

    function saveEditedActivity(activity: ActivityType) {
        const index = activities.findIndex((a) => a.activityId === activity.activityId);
        if (index !== -1) {
            const updatedActivities = [...activities]
            updatedActivities[index] = activity
            setActivities(updatedActivities)
            setEdittingActivity(null)
        }
    }
    
    return (
        <Box my="20px">
            <FormControl isRequired>
                <FormLabel fontSize="14px">Actividade</FormLabel>

                {
                    activities.map((activity, index) => (
                        <ListActivityItem
                            key={index}
                            activity={activity}
                            onDelete={handleOnDeleteActivity}
                            onEdit={handleOnEditActivity}
                            editingActivity={edittingActivity}
                            updateList={saveEditedActivity}
                            setEditing={setEditting}
                        />
                    ))
                }
                <Flex
                    alignItems={'center'}
                    gap={2}
                >
                    <ZenTaakIcon
                        package="githubocticonsicons"
                        name="GoChecklist"
                        size={24}
                        color="#555"
                    />
                    <Input
                        height="50px"
                        fontSize={16}
                        color={"#555"}
                        variant={"unstyled"}
                        onKeyDown={onKeyDown}
                        onChange={onChange}
                        value={activity}
                        placeholder="Adicione uma actividade e pressione a tecla enter"
                        _placeholder={{ fontSize: 15, color: "#555", opacity: 0.8 }}
                    />
                </Flex>
            </FormControl>
        </Box>
    )
}