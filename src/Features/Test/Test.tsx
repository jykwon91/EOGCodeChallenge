import React, { FunctionComponent, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from "@material-ui/core/LinearProgress";
import gql from 'graphql-tag';
import { IState } from '../../store';
import { actions } from "./reducer";
import { useQuery } from "react-apollo-hooks";
import { useLazyQuery } from "@apollo/react-hooks";
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from "react-apollo-hooks";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from 'apollo-cache-inmemory';

// Create an http link:
const httpLink = new HttpLink({
  uri: 'https://react.eogresources.com/graphql',
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'ws://react.eogresources.com/graphql',
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink,
);

const theClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
const getTestList = (state: IState) => {
  const { testList } = state.test;
  return {
    testList,
  };
};

export default () => {
  return (
    <ApolloProvider client={theClient}>
      <Test />
    </ApolloProvider>
  )
};

const Test = () => {
  const dispatch = useDispatch();
  const { testList } = useSelector(getTestList);
  const query = gql`
    {
      getMetrics
    }
  `;
  
  // Get graphql data for metric getMetrics which
  // returns a list of metric categories
  const result = useQuery(query);
  const { loading, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.testApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getTestList } = data;
    dispatch(actions.testDataRecevied(getTestList));
  }, [data]);

  if (loading) return <LinearProgress />;

  console.log('test rendered', actions);
  return (
    <div></div>
  );
};