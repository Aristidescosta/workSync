import { useTeamStore } from "@/src/hooks/useTeam";
import { Box, HStack, Heading, Spacer } from "@chakra-ui/react";
import Card from "./Components/Cards";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { useEffect, useState } from "react";
import { useGraphStatsStore } from "@/src/hooks/useGraphStats";
import AssignedTaskGraph from "./Components/AssignedTaskGraph";
import ReactGaugeChart from "@/react-gauge-chart";


export default function GraphPage(): JSX.Element {

    const team = useTeamStore(state => state.team)

    const workspace = useWorkspaceStore(state => state.workspace)

    const getTaskStats = useGraphStatsStore(state => state.getTaskStats)
    const taskStatsBase = useGraphStatsStore(state => state.taskStatsBase)
    const barData = useGraphStatsStore(state => state.barData)

    const [x, setX] = useState<number>(0)

    useEffect(() => {
        if (team) {
            const unsubscribe = getTaskStats(team.teamId)
            return () => unsubscribe()
        }
    }, [])

    /* useEffect(() => {   
        setDateStats(`${workspace?.workspaceId}_06-03-2024`)
    }, []) */

    useEffect(() => {
        console.log(taskStatsBase.dueIndexTeamRate)
        setX(taskStatsBase.dueIndexTeamRate)
    }, [taskStatsBase.dueIndexTeamRate])

    return (
        <Box
            overflow={'auto'}
            height={'80vh'}
            mb={4}
        >
            <Box
                bg="white"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={10}
                h={'7vh'}
            >
                <Heading as="h1" fontSize="22px">
                    Dashboard ● {team?.teamName}
                </Heading>
            </Box>

            <HStack
                py={4}
                pl={10}
                justifyContent={'space-between'}
                cursor={'pointer'}
                _hover={{
                    bg: '#fafafa',
                }}
            >
                <Card
                    color={"#118844"}
                    countNumber={taskStatsBase.completedTasks}
                    title={"Tarefas Completadas"}
                    icon="GoChecklist"
                />
                <Card
                    color={"#FF8000"}
                    countNumber={taskStatsBase.incompletedTasks}
                    title={"Tarefas incompletas"}
                    icon="GoFile"
                />
                <Card
                    color={"#DD0000"}
                    countNumber={taskStatsBase.totalDueTasks}
                    title={"Tarefas atrasadas"}
                    icon="GoCalendar"
                />
                <Card
                    color={"#2595E7"}
                    countNumber={taskStatsBase.totalTasks}
                    title={"Total de Tarefas"}
                    icon="GoGraph"
                />
            </HStack>
            <HStack
                pl={10}
                gap={10}
                justifyContent={'space-between'}
                cursor={'pointer'}
                _hover={{
                    bg: '#fafafa',
                }}
            >
                <AssignedTaskGraph
                    barData={barData}
                />
                <ReactGaugeChart
                    title="Taxa de Conclusão de Tarefas"
                    value={taskStatsBase.completedTeamRate}
                    isNegativeIndicator={false}
                />
            </HStack>
            <Spacer height={5} />
            <HStack
                pl={10}
                gap={10}
                justifyContent={'space-between'}
                cursor={'pointer'}
                _hover={{
                    bg: '#fafafa',
                }}
            >
                <ReactGaugeChart
                    title="Índice de Atraso de Tarefas"
                    value={taskStatsBase.dueIndexTeamRate}
                    isNegativeIndicator={true}
                />
                <ReactGaugeChart
                    title="Eficiência de Conclusão de Tarefas"
                    value={taskStatsBase.completedEfficiencyTeamRate}
                    isNegativeIndicator={false}
                />
            </HStack>
        </Box>
    )
}