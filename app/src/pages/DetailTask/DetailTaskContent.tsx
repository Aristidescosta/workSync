import { Box, Button, Checkbox, CheckboxGroup, Divider, Flex, FormControl, Spacer, Stack, Text, Textarea } from "@chakra-ui/react";
import { ActivityType } from "@/src/types/ActivityType";
import DetailTaskListComment from "./DetailTaskListComment";
import { UserType } from "@/src/types/UserType";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { useEffect, useState } from "react";
import { StateTask, TaskType } from "@/src/types/TaskType";
import FormattedViewTextArea from "@/src/components/FormattedViewTextArea";
import { useTaskStore } from "@/src/hooks/useTask";
import DetailTaskTimeline from "./components/DetailTaskTimeline";
import generateId from "@/src/services/UUID";
import { useUserSessionStore } from "@/src/hooks/useUserSession";

interface DetailTaskContent {
    task: TaskType
    about: string
    activities: ActivityType[]
    user: UserType | undefined
}

export default function DetailTaskContent(props: DetailTaskContent): JSX.Element {

    const {
        task,
        about,
        activities,
        user
    } = props

    const [loading, setLoading] = useState<boolean>(false)
    const [reportTask, setReportTask] = useState<string | undefined>(task.userReport)
    const [progress, setProgress] = useState<{ progress: number, state: StateTask }>()
    const [handleProgress, setHandleProgress] = useState<ActivityType[]>([])
    const [activityChecked, setActivityChecked] = useState<ActivityType>()

    const setProgressTask = useTaskStore(state => state.setProgressTask)
    const updateStateActivityProgressTask = useTaskStore(state => state.updateStateActivityProgressTask)
    const saveLogs = useTaskStore(state => state.saveLogs)
    const observingLogsOnTask = useTaskStore(state => state.observingLogsOnTask)
    const resetLogs = useTaskStore(state => state.resetLogs)
    const logs = useTaskStore(state => state.logs)

    const userSession = useUserSessionStore(state => state.userSession)

    const { toastMessage, ToastStatus } = useToastMessage();

    useEffect(() => {
        const progress = (handleProgress.length / task.activities.length) * 100
        setProgressTask(progress)
        setProgress({ progress, state: (progress > 0 && progress < 100) ? "Em andamento" : progress === 0 ? "Não iniciada" : "Em revisão" })
    }, [handleProgress.length])

    useEffect(() => {
        setHandleProgress(task.activities.filter(a => a.isDone === true))

        if (task) {
            const unsubscribe = observingLogsOnTask(task.taskId)
            return () => {
                unsubscribe()
                resetLogs()
            }
        }
    }, [])

    function handleActivityChecked(activity: ActivityType) {
        setHandleProgress(state => {

            if (state.includes(activity)) {
                activity.isDone = false
                const activities = state.filter(s => s.activityId !== activity.activityId)

                if (activities.length === 0) {
                    setActivityChecked(undefined)
                } else {
                    setActivityChecked(activity)
                }

                if (user) {
                    saveLogs({
                        logId: generateId(),
                        action: "anulou",
                        createAt: new Date(),
                        data: activities.length === 0 ? "todas actividades" : `${activities.length} de ${task.activities.length} ${task.activities.length > 1 ? "actividades" : "actividade"}`,
                        icon: "GoChecklist",
                        user
                    })
                }

                return activities
            }

            activity.isDone = true
            setActivityChecked(activity)

            if (user) {
                saveLogs({
                    logId: generateId(),
                    action: "completou",
                    createAt: new Date(),
                    data: `${handleProgress.length + 1} de ${task.activities.length} ${task.activities.length > 1 ? "actividades" : "actividade"}`,
                    icon: "GoChecklist",
                    user
                })
            }

            return [...state, activity]
        })
    }

    function handleReportTask(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setReportTask(e.target.value)
    }

    function saveReport() {
        if (userSession) {
            setLoading(true)
            updateStateActivityProgressTask(userSession, activityChecked, progress?.progress, progress?.state, reportTask, task.deadline.getDueDays())
                .then(() => {
                    setLoading(false)
                })
                .catch(error => {
                    setLoading(false)
                    toastMessage({
                        title: "Detalhes da tarefa",
                        description: error,
                        statusToast: ToastStatus.INFO,
                        position: "bottom"
                    })
                })
        }
    }

    return (
        <Box
            borderRightWidth={1}
            borderRightColor={'gray.100'}
            pr={6}
            w={'full'}
        >
            <Text
                fontSize={'medium'}
                fontWeight={'semibold'}
            >
                Sobre a tarefa
            </Text>
            <FormattedViewTextArea
                text={about}
            />
            <Spacer height={10} />
            <Text
                fontSize={'medium'}
                fontWeight={'semibold'}
            >
                Actividades
            </Text>
            <CheckboxGroup
                colorScheme='red'
            >
                <Stack
                    spacing={[1, 2]}
                    pt={2}
                >
                    {
                        activities.map((activity, index) => (
                            <Checkbox
                                key={index}
                                size={'lg'}
                                alignItems={'flex-start'}
                                mb={4}
                                isChecked={activity.isDone}
                                onChange={() => handleActivityChecked(activity)}
                                disabled={task.assignedOf.filter(u => u.id === user?.session.id).length !== 1}
                            >
                                <Text
                                    lineHeight={1}
                                >
                                    {activity.activity}
                                </Text>
                            </Checkbox>
                        ))
                    }
                </Stack>
            </CheckboxGroup>
            <Spacer height={10} />
            <Text
                fontSize={'medium'}
                fontWeight={'semibold'}
            >
                Relatório
            </Text>
            {
                task.assignedOf.filter(u => u.id === user?.session.id).length === 1 ?
                    <FormControl>
                        <Textarea
                            mt={2}
                            size="md"
                            minHeight={"80px"}
                            maxH={"150px"}
                            border="1px solid #ddd"
                            value={reportTask}
                            onChange={handleReportTask}
                            _placeholder={{ fontSize: 13, color: "#555", opacity: 0.8 }}
                            placeholder={`**Título** \nEscreva o seu relatório`}
                        />
                        <Flex
                            p={1}
                            justifyContent={'flex-end'}
                        >
                            <Button
                                variant={'link'}
                                colorScheme="red"
                                fontSize={'sm'}
                                isLoading={loading}
                                isDisabled={activityChecked === undefined && (reportTask === undefined || reportTask === "")}
                                onClick={saveReport}
                            >
                                Salvar
                            </Button>
                        </Flex>
                    </FormControl>
                    :
                    <FormattedViewTextArea
                        text={task.userReport}
                    />
            }
            {
                logs.map(log => (
                    <DetailTaskTimeline
                        key={log.logId}
                        taskLog={log}
                    />
                ))
            }
            <Divider />
            <Spacer height={4} />
            <DetailTaskListComment
                user={user}
                task={task}
            />
        </Box>
    )
}