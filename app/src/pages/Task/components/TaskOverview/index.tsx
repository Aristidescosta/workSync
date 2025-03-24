import { ZenTaakPieChart } from "@/muix-charts";
import { Box, Flex, HStack, Heading, Spacer } from "@chakra-ui/react";
import ListActivities from "./ListActivities";
import { useLogsActivitiesStore } from "@/src/hooks/useLogsActivities";
import { useEffect } from "react";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useGraphStatsStore } from "@/src/hooks/useGraphStats";
import { MakeOptional } from "@mui/x-charts/models/helpers";
import { PieValueType } from "@mui/x-charts";

export default function TaskOverview(): JSX.Element {

    const showLogs = useLogsActivitiesStore(state => state.showLogs)
    const logs = useLogsActivitiesStore(state => state.logs)

    const team = useTeamStore(state => state.team)

    const taskStatsBase = useGraphStatsStore(state => state.taskStatsBase)

    useEffect(() => {

        if (team) {
            const unsubscribe = showLogs(team.teamId)
            return () => unsubscribe()
        }

    }, [])

    const data: MakeOptional<PieValueType, "id">[] = [
        { value: taskStatsBase.completedTasks, label: 'Finalizadas', color: '#009C5B' },
        { value: taskStatsBase.incompletedTasks, label: 'Incompletas', color: '#D7D01F' },
        { value: taskStatsBase.totalDueTasks, label: 'Atrasadas', color: '#DD0000' },
        { value: taskStatsBase.totalTasks, label: 'Criadas', color: '#939393' },
        { value: taskStatsBase.totalAssignedTasks, label: 'Atribuídas', color: '#A101F2' },
    ];

    return (
        <Box
            bg={'#fff'}
            width={'lg'}
            h={'100vh'}
            pos={'relative'}
        >
            {
                logs.length === 0 ?
                    <Flex
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Heading
                            fontSize={'md'}
                            p={4}
                            color={'gray.400'}
                        >
                            Sem actividades recentes
                        </Heading>
                    </Flex>
                    :
                    <>
                        <HStack>
                            <Heading
                                fontSize={'lg'}
                                pl={4}
                                pt={6}
                            >
                                Visão geral do projecto
                            </Heading>
                        </HStack>
                        <Spacer height={10} />
                        <ZenTaakPieChart
                            series={[{ data, innerRadius: 80 }]}
                            width={400}
                            height={200}
                        />
                        <Spacer height={10} />

                        <Heading
                            fontSize={'lg'}
                            p={4}
                        >
                            Actividades recentes
                        </Heading>
                        <ListActivities
                            logs={logs}
                        />
                    </>
            }
        </Box>
    )
}