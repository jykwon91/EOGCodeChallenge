import React, { memo } from 'react';
import { useSelector } from 'react-redux';
// import { makeStyles } from '@material-ui/core/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import moment from "moment";
import { IState } from "../../store";

// const useStyles = makeStyles(theme => ({
//   title: {
//     fontSize: 14,
//   },
//   pos: {
//     marginBottom: 12,
//   },
// }));

const strokeArr = ["#8884d8", "#82ca9d", "#0048d9", "#fc9219", "#8e19fc", "#ff0593"];

const getGraphData = (state: IState) => {
  const { measurements } = state.metricGraph;
  return {
    measurements,
  };
};

const getMetricCardList = (state: IState) => {
  const { metricCardList } = state.metricCard;
  return {
    metricCardList,
  };
};

const formatXAxis = (tickItem: number) => {
  // If using moment.js
  return moment
    .utc()
    .millisecond(tickItem)
    .format('h:mm:ss');
};

const getLabel = (metricCardList: any[], metric: string) => {
  let returnStr = '';
  metricCardList.forEach(element => {
    if (element.metric === metric) {
      returnStr = element.unit;
    }
  });
  return returnStr;
};

type MetricCard = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

const CustomTooltip = (action: any) => {
  const temp: MetricCard[] = [{ metric: "", at: 0, value: 0, unit: "" }];

  if (action.active) {
    if (action.payload !== null) {
      action.payload.forEach((element: any) => {
        temp.push(element.payload);
      });
      temp.splice(0, 1);
    }
    return (
      <div className="custom-tooltip">
        {temp.map((item: any, i: number) => (
          <p className="label" key={i}>{`${item.metric}: ${item.value} ${item.unit}`}</p>
        ))}
      </div>
    );
  }

  return null;
};

const createLine = (item: any, i: number) => (
  <Line dataKey="value" data={item.measurements} dot={false} stroke={strokeArr[i]} key={i} />
)

const MetricGraph = (props:any) => {
  // const classes = useStyles();
  const { measurements } = useSelector(getGraphData);
  const { metricCardList } = useSelector(getMetricCardList);

  return (
    <LineChart width={1100} height={600}>
      <XAxis dataKey="at" allowDuplicatedCategory={false} tickFormatter={formatXAxis} />
      {measurements.map(createLine)}
      <YAxis />

      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );
};

// {measurements.map((item:any, i:number) => (
//   <YAxis key={item.metric} label={{value:getLabel(metricCardList, item.metric), angle: -90, position: 'insideLeft'}}/>
// ))}

export default memo(MetricGraph);
