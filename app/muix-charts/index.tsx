import { BarChart, BarChartProps, } from '@mui/x-charts/BarChart';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/src/services/chakra-ui-api/ZenTaakTheme';

export function ZenTaakBarChart(props: BarChartProps): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <BarChart
                xAxis={props.xAxis}
                series={props.series}
                height={400}
                slotProps={{
                    legend: {
                        itemMarkWidth: 10,
                        itemMarkHeight: 10
                    }
                }}
            />
        </ThemeProvider>
    )
}

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

export function ZenTaakPieChart(props: PieChartProps): JSX.Element {

    function totalTasks(): string {
        if (props.series[0].data.length > 0) {
            const total = props.series[0].data[3].value
            return `${total} ${(total > 1) ? "tarefas" : "tarefa"}`
        }

        return ""
    }

    function PieCenterLabel({ children }: { children: React.ReactNode }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2}>
                {children}
            </StyledText>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <PieChart
                series={props.series}
                width={props.width}
                height={props.height}
                slotProps={{
                    legend: {
                        itemMarkWidth: 10,
                        itemMarkHeight: 10
                    }
                }}
            >
                <PieCenterLabel>{totalTasks()}</PieCenterLabel>
            </PieChart>
        </ThemeProvider>
    )
}