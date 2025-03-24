import { Box } from "@chakra-ui/react";
import Activity from "./Activity";
import { LogActivityType } from "@/src/types/LogActivityType";

interface ListActivities {
    logs: LogActivityType[]
}

export default function ListActivities(props: ListActivities): JSX.Element {

    const {
        logs
    } = props

    return (
        <Box
            pos={'absolute'}
            w={'full'}
            h={'50vh'}
            overflow={'auto'}
        >
            {
                logs.map(log => (
                    <Activity
                        key={log.logId}
                        activity={log}
                    />
                ))
            }
        </Box>
    )
}