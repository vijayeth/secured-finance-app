import {
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    LinearScale,
    LineElement,
    PointElement,
    Scriptable,
    ScriptableContext,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useEffect, useRef } from 'react';
import { ChartProps, getElementAtEvent, Line } from 'react-chartjs-2';
import {
    crossHairPlugin,
    defaultDatasets,
    getCurveGradient,
    options as customOptions,
} from 'src/components/molecules/LineChart/constants';
import { MaturityOptionList } from 'src/types';
import { Maturity } from 'src/utils/entities';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip,
    crossHairPlugin
);

const triggerHover = (chart: ChartJS<'line'>, index: number) => {
    chart.setActiveElements([
        {
            datasetIndex: 0,
            index: index,
        },
    ]);
    chart.update();
};

const triggerTooltip = (chart: ChartJS<'line'>, index: number) => {
    const tooltip = chart.tooltip;
    if (tooltip) {
        const chartArea = chart.chartArea;
        tooltip.setActiveElements(
            [
                {
                    datasetIndex: 0,
                    index: index,
                },
            ],
            {
                x: (chartArea.left + chartArea.right) / 2,
                y: (chartArea.top + chartArea.bottom) / 2,
            }
        );
    }
    chart.update();
};

export type LineChartProps = {
    style?: React.CSSProperties;
    data: ChartData<'line'>;
    maturitiesOptionList: MaturityOptionList;
    maturity: Maturity;
    handleChartClick: (maturity: Maturity) => void;
} & ChartProps;

export const LineChart = ({
    data = { datasets: [], labels: [] },
    options = customOptions,
    style,
    maturitiesOptionList,
    maturity,
    handleChartClick,
}: LineChartProps) => {
    const chartRef = useRef<ChartJS<'line'>>(null);

    const refinedDatasets = data.datasets.map(set => {
        if (defaultDatasets) {
            return {
                borderCapStyle: 'round' as Scriptable<
                    CanvasLineCap,
                    ScriptableContext<'line'>
                >,
                borderColor: (context: ScriptableContext<'line'>) =>
                    getCurveGradient(context),
                ...defaultDatasets,
                ...set,
            };
        }
        return {
            ...set,
        };
    });

    const refinedData = {
        ...data,
        datasets: refinedDatasets,
    };

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!chartRef.current) return;

        const element = getElementAtEvent(chartRef.current, event);
        if (element && element[0]) {
            const { index } = element[0];
            const label = data.labels?.[index];
            const selectedMaturity = maturitiesOptionList.find(
                element => element.label === label
            );
            if (selectedMaturity) {
                handleChartClick(selectedMaturity.value);
            }
        }
    };

    useEffect(() => {
        if (!chartRef.current) return;

        const numberOfElements = chartRef.current.data.datasets[0].data.length;
        let index = maturitiesOptionList.findIndex(element =>
            element.value.equals(maturity)
        );

        if (numberOfElements) {
            index = index > 0 ? index : 0;
            triggerHover(chartRef.current, index);
            triggerTooltip(chartRef.current, index);
        }
    }, [maturity, maturitiesOptionList]);

    return (
        <Line
            data-chromatic='ignore'
            style={style}
            data={refinedData}
            options={options}
            ref={chartRef}
            onClick={handleClick}
        />
    );
};
