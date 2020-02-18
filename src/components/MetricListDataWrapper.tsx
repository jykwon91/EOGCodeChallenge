import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useSubscription } from 'react-apollo-hooks';
import LinearProgress from "@material-ui/core/LinearProgress";
//import { actions } from "../Features/Test/reducer";
import MetricCard from "../Features/MetricCard/MetricCard";
import { IState } from '../store';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';

type CardProp = {
  metric: string;
  value: number;
  at: number;
  unit: string;
};

const subscription = gql`
  subscription {
    newMeasurement {
      metric
      value
      at
      unit
    }
  }
`;

const getSelectedMetrics = (state: IState) => {
  const { selectedMetricListMetricCard } = state.metrics;
  return {
    selectedMetricListMetricCard,
  };
};

const MetricListDataWrapper = (props:any) => {
  const [cardList, setCardList] = useState<CardProp[]>([]);
  const result = useSubscription(subscription);
  const { selectedMetricListMetricCard } = useSelector(getSelectedMetrics);

  const { client, epoch } = props.props;

  //console.log("metriclistdatawrapper");
  const { data, error, loading } = result;

  useEffect(() => {
    if (error) {
      console.log(error);
      return;
    }
    if (!data) return;

    let index = -1;
    for (let i = 0; i < cardList.length; i++) {
      if (cardList[i].metric === data.newMeasurement.metric) {
        index = i;
      }
    }
    if (index === -1) {
      cardList.push(data.newMeasurement);
    } else {
      cardList[index] = data.newMeasurement;
    }

    let tempList:CardProp[] = cardList.filter((card) => selectedMetricListMetricCard.includes(card.metric));
    setCardList(tempList);

  }, [data, error, loading]);

  if (loading) return <LinearProgress />;

  let rows = [];
  for (let i=0; i<cardList.length; i++) {
    rows.push(<MetricCard key={i} metric={cardList[i]} client={client} epoch={epoch}/>);
  }

  return (
    <div>{rows}</div>
  );
};

export default (props:any) => {
  return (
      <MetricListDataWrapper props={props} />
  )
};