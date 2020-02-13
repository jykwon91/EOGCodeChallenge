import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import LinearProgress from "@material-ui/core/LinearProgress";
import { useQuery } from "react-apollo-hooks";
import { actions } from "../Features/MetricGraph/reducer";
import { IState } from '../store';
import MetricGraph from '../Features/MetricGraph/MetricGraph';

const getSelectedMetricList = (state: IState) => {
  const { selectedMetricList } = state.metrics;
  return {
    selectedMetricList,
  };
};

const MetricGraphData = () => {
  const dispatch = useDispatch();
  const { selectedMetricList } = useSelector(getSelectedMetricList);

  const input = [{}];
  selectedMetricList.forEach(element => {
    input.push({ metricName: element, after: 1581553591000 });
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
  });

  const { data, error, loading } = result;

  useEffect(() => {
    if (error) {
      console.log(error);
      return;
    }
    if (!data) return;

    dispatch(actions.metricGraphDataRecevied(data.data));
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <MetricGraph props={{'update':true}}/>
  );
}
export default memo(MetricGraphData);
