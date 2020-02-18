import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import moment from "moment";
import { getDataFromTree } from 'react-apollo';

type CardProp = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

const strokeArr = ["#8884d8", "#82ca9d", "#0048d9", "#fc9219", "#8e19fc", "#ff0593"];

const formatXAxis = (tickItem: number) => {
  // If using moment.js
  return moment
    .utc()
    .millisecond(tickItem)
    .format('h:mm');
};

type MetricCard = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

const getDate = (theDate:number) => {
  //console.log(moment.utc().millisecond(theDate).format('MM-DD h:mm'));
  const date = moment.utc().millisecond(theDate).format('MM-DD HH:mm');
  const stillUtc = moment.utc(date).toDate();
  const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  return local;
}

const CustomTooltip = (action: any) => {
  const temp: MetricCard[] = [{ metric: "", at: 0, value: 0, unit: "" }];
  let timestamp = 0;
  if (action.active) {
    if (action.payload !== null) {
      action.payload.forEach((element: any) => {
        temp.push(element.payload);
        timestamp = element.payload.at;
      });
      temp.splice(0, 1);
    }
    return (
      <div className="custom-tooltip">
        <p>{getDate(timestamp)}</p>
        {temp.map((item: any, i: number) => (
          <div key={i}>
            <p className="label" style={{color:strokeArr[i]}}>{`${item.metric}: ${item.value} ${item.unit}`}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const createLine = (item: any, i: number) => (
  <Line dataKey="value" data={item.measurements} dot={false} stroke={strokeArr[i]} key={i} />
)

const MetricGraph = ({measurements} : {measurements:CardProp[]}) => {
  //console.log(measurements);
  console.log("metricgraph rendered");
  return (
    <LineChart width={1100} height={600}>
      <XAxis dataKey="at" allowDuplicatedCategory={false} tickFormatter={formatXAxis} />
      {measurements.map(createLine)}
      <YAxis />

      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );
};

export default memo(MetricGraph);
