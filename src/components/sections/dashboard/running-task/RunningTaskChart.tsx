import { useMemo } from 'react';
import { useTheme, SxProps } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { TooltipComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
// import { EChartOption } from 'echarts';

echarts.use([TooltipComponent, GaugeChart, SVGRenderer]);

interface RunningTaskChartProps {
  data: {
    value: number;
    detail: {
      valueAnimation: boolean;
      offsetCenter: string[];
    };
  }[];
  sx?: SxProps;
}

const RunningTaskChart = ({ data, ...rest }: RunningTaskChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        backgroundColor: theme.palette.info.lighter,
        padding: [8, 10, 8, 10],
        borderRadius: 10,
        borderWidth: 0,
        textStyle: {
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        },
        // formatter: (params: EChartOption.Tooltip.Format) => {
        //   return `<div style="display:flex; align-items:center; justify-content:center; gap:0.35rem">
        //     <div style="height:0.625rem; width:0.625rem; background:${theme.palette.primary.main}; border-radius:50%"></div>
        //     <p style="font-size:${theme.typography.body1.fontSize}; font-weight:800">${params.value}%</p>
        //   </div>`;
        // },
      },
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          radius: '100%',
          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 0,
            },
          },
          axisLine: {
            lineStyle: {
              width: 3,
              color: [[1, theme.palette.neutral.darker]],
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 50,
          },
          data: data,
          title: {
            fontSize: 14,
          },
          detail: {
            fontSize: 18,
            fontWeight: 500,
            color: theme.palette.info.light,
            fontFamily: theme.typography.fontFamily,
            formatter: '{value}%',
          },
        },
      ],
    }),
    [theme],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default RunningTaskChart;
