import { ZenTaakBarChart } from "@/muix-charts";
import GraphCardContent from "./GraphCardContent";
import { BarChartProps } from "@mui/x-charts";

interface AssignedTaskGraph1 {
    barData: BarChartProps
}

export default function AssignedTaskGraph(props: AssignedTaskGraph1): JSX.Element {

    return (
        <GraphCardContent
            customStyle={{
                flex: 1
            }}
        >
            <ZenTaakBarChart
                xAxis={props.barData.xAxis}
                series={props.barData.series}
            />
        </GraphCardContent>
    )
}