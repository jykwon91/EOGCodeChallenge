import React, { useEffect, memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import LinearProgress from "@material-ui/core/LinearProgress";
import { useQuery } from "react-apollo-hooks";
import { IState } from '../store';
import MetricGraph from '../Features/MetricGraph/MetricGraph';
import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { actions } from "../Features/Metrics/reducer";
import { Query } from "react-apollo";

const getSelectedMetricList = (state: IState) => {
  const { selectedMetricList } = state.metrics;
  return {
    selectedMetricList,
  };
};

const getEpochTime = () => {
  //timestamp in milliseconds
  let now = Date.now();
  //30 minutes before now
  return now = now - 1800000;
}

//const MetricGraphData = ({client} : {client:ApolloClient<NormalizedCacheObject>}, {epoch} : {epoch:number}) => {
const MetricGraphData = (props:any) => {
  const { selectedMetricList } = useSelector(getSelectedMetricList);
  const dispatch = useDispatch();
  const { client, epoch } = props.props;

  const input = [{}];
  selectedMetricList.forEach(element => {
    input.push({ metricName: element, after: epoch });
  });
  input.splice(0, 1);

  const query = gql`
    query Measurements($input: [MeasurementQuery]) {
      data: getMultipleMeasurements(input: $input) {
        metric
        measurements {
          metric
          value
          at
          unit
        }
      }
    }
  `;

  // const result = useQuery(regQuery);
  const result = useQuery(query, {
    variables: { input },
    pollInterval: 2000,
  });

  const { data, error, loading } = result;
  //console.log(result);
  useEffect(() => {
    if (error) {
      console.log(error);
      return;
    }
    if (!data) return;

    dispatch(actions.metricListMetricCardUpdate(selectedMetricList));
  }, [data, error, loading]);

  console.log("metricgraphdata rendered");

  const METRICS_QUERY = gql`
    query ReadMeasurements($input: [MeasurementQuery]) {
      getMultipleMeasurements(input: $input) {
        metric
        measurements {
          metric
          value
          at
          unit
        }
      }
    }`;
  const measurements = useQuery(METRICS_QUERY, {
    variables: { input },
  });
  //console.log(measurements);
  const { data: getMultipleMeasurements, error: measurementError, loading: measurementLoading } = measurements;
  //console.log(getMultipleMeasurements);
  // const measurements = client.readQuery({
  //     query: gql`
  //       query ReadMeasurements($input: [MeasurementQuery]) {
  //         getMultipleMeasurements(input: $input) {
  //           metric
  //           measurements {
  //             metric
  //             value
  //             at
  //             unit
  //           }
  //         }
  //       }
  //     `,
  //     variables: {
  //       input: input,
  //     },
  // });

  //console.log(measurements.getMultipleMeasurements);
  if (measurementLoading) return <LinearProgress />;
  
  //console.log(getMultipleMeasurements);
  return (
    <MetricGraph measurements={getMultipleMeasurements.getMultipleMeasurements}/>
  );
}

//export default memo(MetricGraphData);
export default (props:any) => {
  return <MetricGraphData props={props}/>;
};