import { useMemo } from 'react';
import { SxProps, useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
// import { EChartOption } from 'echarts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface ActivityChartProps {
  data?: number[];
  sx?: SxProps;
}

const ActivityChart = ({ data, ...rest }: ActivityChartProps) => {
  const theme = useTheme();
  // let isTopOffset: boolean;

  const option = useMemo(
    () => ({
      grid: {
        top: 24,
        bottom: 36,
        left: 44,
        right: 24,
        containerLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
          label: {
            backgroundColor: theme.palette.info.light,
          },
        },
        backgroundColor: theme.palette.primary.dark,
        padding: [10, 18, 10, 18],
        borderRadius: 10,
        borderWidth: 0,
        textStyle: {
          color: theme.palette.info.light,
          fontFamily: theme.typography.fontFamily,
        },
        extraCssText: 'border: none; box-shadow: none',
        confine: true,
        // position: (
        //   point: [number, number],
        //   // _params: EChartOption.Tooltip.Format[],
        //   _dom: HTMLElement,
        //   _rect: unknown,
        //   size: { contentSize: [number, number]; viewSize: [number, number] },
        // ) => {
        //   const [x, y] = point;
        //   const tooltipHeight = size.contentSize[1];
        //   const topOffset = y - tooltipHeight - 20;
        //   const bottomOffset = y + 20;

        //   if (topOffset > 0) {
        //     isTopOffset = true;
        //     return [x - size.contentSize[0] / 2, topOffset];
        //   } else {
        //     isTopOffset = false;
        //     return [x - size.contentSize[0] / 2, bottomOffset];
        //   }
        // },
        // formatter: (params: EChartOption.Tooltip.Format | EChartOption.Tooltip.Format[]) => {
        //   if (Array.isArray(params)) {
        //     const dataValue = Math.round(params[0].data);
        //     const arrowPosition = isTopOffset ? 'bottom:-14px;' : 'top:-14px;';
        //     return `<div style="position:relative; border-radius:10px;">
        //       <p style="font-size:${theme.typography.body2.fontSize}; font-weight:500">${dataValue} Task</p>
        //       <span style="position:absolute; ${arrowPosition} left:50%; transform:translate(-50%) rotate(45deg); width:12px; height:12px; background:${theme.palette.primary.dark}; border-top:none; border-left:none; border-right:none; border-bottom:none; z-index:-10000;"></span>
        //     </div>`;
        //   }
        //   return '';
        // },
      },
      xAxis: {
        type: 'category',
        data: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          margin: 10,
          color: theme.palette.text.primary,
          fontSize: theme.typography.caption.fontSize,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 600,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid',
            width: 1,
            color: theme.palette.info.main,
          },
        },
        boundaryGap: 0,
      },
      yAxis: {
        type: 'value',
        min: 1,
        minInterval: 1,
        splitLine: {
          show: false,
        },
        axisLabel: {
          margin: 20,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.caption.fontSize,
          fontWeight: 600,
        },
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'none',
            scale: 3,
            itemStyle: {
              borderWidth: 4,
            },
          },
          lineStyle: {
            width: 3,
            type: 'solid',
            cap: 'round',
            color: theme.palette.text.primary,
            shadowColor: theme.palette.info.dark,
            shadowOffsetX: -2,
            shadowOffsetY: 12,
          },
        },
      ],
    }),
    [theme, data],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default ActivityChart;
