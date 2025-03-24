export type TaskStatsType = {
    [x: string]: {
        totalTasks: number
        totalAssignedTasks: number
        incompletedTasks: number
        inProgressTasks: number
        completedTasks: number
        completedDueTasks: number
        totalDueTasks: number
        assignedTaskBy: Record<string, object>
        inProgressTaskBy: Record<string, object>
        incompletedTaskBy: Record<string, object>
        completedTaskBy: Record<string, object>
        assignedDueTaskBy: Record<string, object>
    }
}

export type TaskStatsBaseType = {
    totalTasks: number
    totalAssignedTasks: number
    incompletedTasks: number
    inProgressTasks: number
    completedTasks: number
    totalDueTasks: number
    completedTeamRate: number
    dueIndexTeamRate: number
    completedEfficiencyTeamRate: number
}