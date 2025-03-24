import { create } from "zustand"
import { TaskStatsBaseType, TaskStatsType } from "../types/TaskStatsType"
import TaskStatsService from "../services/firebase/firestore/TaskStatsService"
import { Unsubscribe } from "firebase/firestore"
import { AxisConfig, BarChartProps, BarSeriesType } from "@mui/x-charts"
import { MakeOptional } from "@mui/x-charts/models/helpers"

interface State {
    taskStats: TaskStatsType
    taskStatsBase: TaskStatsBaseType
    barData: BarChartProps
}

const initialStateBase = {
    totalTasks: 0,
    totalAssignedTasks: 0,
    incompletedTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalDueTasks: 0,
    completedTeamRate: 0,
    dueIndexTeamRate: 0,
    completedEfficiencyTeamRate: 0,
    completedDueTasks: 0,
}

const initialState: State = {
    taskStats: {
        'someKey': {
            totalTasks: 0,
            totalAssignedTasks: 0,
            incompletedTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
            completedDueTasks: 0,
            totalDueTasks: 0,
            assignedTaskBy: {},
            inProgressTaskBy: {},
            incompletedTaskBy: {},
            completedTaskBy: {},
            assignedDueTaskBy: {}
        }
    },
    taskStatsBase: initialStateBase,
    barData: {
        series: []
    }
}

interface Actions {
    getTaskStats: (teamId: string) => Unsubscribe
}

export const useGraphStatsStore = create<Actions & State>((set, get) => ({
    ...initialState,
    getTaskStats(teamId) {
        return TaskStatsService.shared.getTaskStats(teamId, (taskStats) => {

            const totals: Record<string, number> = {}
            const xAxisAll: string[] = []
            const xAxis: MakeOptional<AxisConfig, "id">[] = [
                {
                    scaleType: "band",
                    data: [],
                },
            ]

            const series: MakeOptional<BarSeriesType, "type">[] = []
            const barData: BarChartProps = {
                series: [],
            }

            for (const key in taskStats) {
                const subObj: Record<string, any> = taskStats[key];

                if (subObj.assignedTaskBy) {
                    for (const userId in subObj.assignedTaskBy) {
                        if (!xAxisAll.includes(userId)) {
                            xAxisAll.push(userId);
                        }
                    }
                }

                if (subObj.assignedDueTaskBy) {
                    for (const userId in subObj.assignedDueTaskBy) {
                        if (!xAxisAll.includes(userId)) {
                            xAxisAll.push(userId);
                        }
                    }
                }

                if (subObj.completedTaskBy) {
                    for (const userId in subObj.completedTaskBy) {
                        if (!xAxisAll.includes(userId)) {
                            xAxisAll.push(userId);
                        }
                    }
                }

                for (const subKey in subObj) {
                    if (!totals[subKey]) {
                        totals[subKey] = 0;
                    }
                    totals[subKey] += subObj[subKey];
                }
            }

            const assignedTaskData: number[] = xAxisAll.map(() => 0);
            const assignedDueTaskData: number[] = xAxisAll.map(() => 0);
            const completedTaskData: number[] = xAxisAll.map(() => 0);

            for (const key in taskStats) {
                const subObj: Record<string, any> = taskStats[key];

                if (subObj.totalTasks) {
                    completedTaskData.fill(subObj.totalTasks);
                }

                if (subObj.assignedTaskBy) {
                    for (const userId in subObj.assignedTaskBy) {
                        const index = xAxisAll.indexOf(userId);
                        if (index !== -1) {
                            assignedTaskData[index] += subObj.assignedTaskBy[userId];
                        }
                    }
                }

                if (subObj.assignedDueTaskBy) {
                    for (const userId in subObj.assignedDueTaskBy) {
                        const index = xAxisAll.indexOf(userId);
                        if (index !== -1) {
                            assignedDueTaskData[index] += subObj.assignedDueTaskBy[userId];
                        }
                    }
                }
            }

            series.push({ data: assignedTaskData, label: 'Atribuída', color: '#A101F2' });
            series.push({ data: assignedDueTaskData, label: 'Atrasada', color: '#DD0000' });
            series.push({ data: completedTaskData, label: 'Finalizada', color: '#009C5B' });

            xAxis[0].data = xAxisAll
            barData.xAxis = xAxis
            barData.series = series


            if (xAxisAll.length === 0) {
                set({
                    taskStatsBase: {
                        totalTasks: totals.totalTasks,
                        totalAssignedTasks: totals.totalAssignedTasks,
                        incompletedTasks: totals.incompletedTasks,
                        inProgressTasks: totals.inProgressTasks,
                        completedTasks: totals.completedTasks,
                        totalDueTasks: (totals.totalDueTasks - totals.completedDueTasks),
                        completedTeamRate: (totals.completedTasks / totals.totalTasks),
                        dueIndexTeamRate: (totals.totalDueTasks / totals.totalTasks),
                        completedEfficiencyTeamRate: (totals.completedTasks - totals.completedDueTasks) / totals.totalTasks,
                    }
                })
            } else {
                set({
                    taskStatsBase: {
                        totalTasks: totals.totalTasks,
                        totalAssignedTasks: totals.totalAssignedTasks,
                        incompletedTasks: totals.incompletedTasks,
                        inProgressTasks: totals.inProgressTasks,
                        completedTasks: totals.completedTasks,
                        totalDueTasks: (totals.totalDueTasks - totals.completedDueTasks),
                        completedTeamRate: (totals.completedTasks / totals.totalTasks),
                        dueIndexTeamRate: (totals.totalDueTasks / totals.totalTasks),
                        completedEfficiencyTeamRate: (totals.completedTasks - totals.completedDueTasks) / totals.totalTasks,
                    },
                    barData
                })
            }
        })
    }
}))