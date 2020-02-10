import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { actions } from '../Features/MetricGraph/reducer';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useQuery } from 'react-apollo-hooks';
import { IState } from '../store';

const getSelectedMetricList = (state: IState) => {
    const { selectedMetricList } = state.metrics;
    return {
      selectedMetricList
    }
};

export default () => {
  const dispatch = useDispatch();
  const { selectedMetricList } = useSelector(getSelectedMetricList);

  let input=[{}];
  selectedMetricList.forEach(element => {
    input.push({metricName: element, after: 1581297841000});
  });
  input.splice(0,1)

  const query = gql`
        query Measurements($input: [MeasurementQuery]) {
            data: getMultipleMeasurements(input: $input){
                metric
                measurements{
                metric,
                value,
                at,
                unit
            }
        }
    }`;

  // const result = useQuery(regQuery);
  const result = useQuery(
    query,{
        variables: { input },
    }
  );

  const { data, error, loading } = result;
  useEffect(() => {
    if (error) {
      console.log(error);
      return;
    }
    if (!data) return;
    dispatch(actions.metricGraphDataRecevied(data.data));
  }, [ dispatch, data, error, loading]);

  if (loading) return <LinearProgress />

  return (
    <div></div>
  );
};