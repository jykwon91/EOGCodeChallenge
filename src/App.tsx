import React, { useState } from 'react';
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from "react-apollo-hooks";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from 'apollo-cache-inmemory';
import MetricGraphData from "./components/MetricGraphData";
import MetricListDataWrapper from "./components/MetricListDataWrapper";
import Wrapper from './components/Wrapper';
import Header from "./components/Header";
import DataController from "./components/DataController";
import Metrics from './Features/Metrics/Metrics';
//import Test from './Features/Test/Test';
import createStore from "./store";

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '640px',
  },
}));

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const getEpochTime = () => {
  //timestamp in milliseconds
  let now = Date.now();
  //30 minutes before now
  return now = now - 1800000;
}

export default () => {
  const classes = useStyles();
  const [epochTime, setEpochTime] = useState<number>(getEpochTime());

  console.log('app');
  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Wrapper>
            <Header />
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Paper className={classes.paper}>
                  <Metrics />
                  <MetricListDataWrapper client={client} epoch={epochTime}/>
                </Paper>
              </Grid>
              <Grid item xs={10}>
                <Paper className={classes.paper}>
                  <MetricGraphData client={client} epoch={epochTime}/>
                </Paper>
              </Grid>
            </Grid>
            <ToastContainer />
          </Wrapper>
        </Provider>
      </MuiThemeProvider>
    </ApolloProvider>
  );
};
