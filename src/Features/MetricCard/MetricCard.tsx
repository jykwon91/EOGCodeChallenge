import React, {useState} from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { IState } from '../../store';
import { useSelector } from 'react-redux';

type CardProp = {
  metric: string;
  value: number;
  at: number;
  unit: string;
};

const getSelectedMetrics = (state: IState) => {
  const { selectedMetricListMetricCard } = state.metrics;
  return {
    selectedMetricListMetricCard,
  };
};

const getEpochTime = () => {
  //timestamp in milliseconds
  let now = Date.now();
  //30 minutes before now
  return now = now - 1800000;
}

const MetricCard = (props:any) => {

  const { client, metric, epoch } = props.props;
  const { selectedMetricListMetricCard } = useSelector(getSelectedMetrics);

  // const input = [{}];
  // selectedMetricListMetricCard.forEach(element => {
  //   input.push({ metricName: element, after: epoch });
  // });
  // input.splice(0, 1);
  // //console.log(client);
  // const metricList = client.readQuery({
  //   query: gql`
  //     query ReadMeasurements($input: [MeasurementQuery]) {
  //       getMultipleMeasurements(input: $input) {
  //         metric
  //         measurements {
  //           metric
  //           value
  //           at
  //           unit
  //         }
  //       }
  //     }
  //   `,
  //   variables: {
  //     input: input,
  //   },
  // });
  // let counter = 0;
  // metricList.getMultipleMeasurements.forEach((el:any) => {
  //   if (el.metric === metric.metric) {
  //     el.measurements = el.measurements.filter((item:any,metric:any) => el.measurements.indexOf(item) === metric);
  //     el.measurements = [...el.measurements, metric];
  //     return;
  //   }
  //   counter++;
  // });
  // let temp:any = metricList.getMultipleMeasurements;
  // console.log("Metric card rendered");
  // client.writeData({ data: { 
  //     metric: metric.metric,
  //     measurements: temp[counter].measurements,
  //     __typename: "MultipleMeasurements",
  //   } 
  // });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h3">
          {metric.metric}
        </Typography>
        <Typography variant="body2" component="p">
          {metric.value} 
          {' '}
          {metric.unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

//export default ({metric} : {metric:any}, {client} : {client:ApolloClient<NormalizedCacheObject>}) => {
export default (props:any) => {
  return <MetricCard props={props}/>;
};