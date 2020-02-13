import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useSubscription } from 'react-apollo-hooks';
import LinearProgress from "@material-ui/core/LinearProgress";
import { actions } from "../Features/MetricCard/reducer";
import MetricCard from "../Features/MetricCard/MetricCard";

// const client = createClient({
//   url: 'https://react.eogresources.com/graphql',
// });

const subscription = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

export default () => {
  const dispatch = useDispatch();
  // const result = useQuery(regQuery);
  const result = useSubscription(subscription);

  const { data, error, loading } = result;
  useEffect(() => {
    if (error) {
      console.log(error);
      return;
    }
    if (!data) return;

    dispatch(actions.metricCardDataRecevied(data.newMeasurement));
  }, [dispatch, data, error, loading]);

  if (loading) return <LinearProgress />;

  return <MetricCard />;
};
