import { TaskType } from "./TaskType"

export type ConstraintType = {
    id: string
    constraintTitle: string
    description: string
    convertedAsTask?: TaskType
}