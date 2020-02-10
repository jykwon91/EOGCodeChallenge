import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import MetricListDataWrapper from './components/MetricListDataWrapper';
import MetricGraph from './Features/MetricGraph/MetricGraph';
import MetricGraphData from './components/MetricGraphData';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Metrics from './Features/Metrics/Metrics';
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from 'react-apollo-hooks';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from "apollo-cache-inmemory";

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
    }
  },
});

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '500px',
  },
}));

// Create an http link:
const httpLink = new HttpLink({
  uri: 'https://react.eogresources.com/graphql'
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://react.eogresources.com/graphql`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

//const client = useApolloClient();

 const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
 });

export default () => {
  const classes = useStyles();


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
                <MetricListDataWrapper />
              </Paper>
            </Grid>
            <Grid item xs={10}>
              <Paper className={classes.paper}>
                <MetricGraphData />
                <MetricGraph />
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