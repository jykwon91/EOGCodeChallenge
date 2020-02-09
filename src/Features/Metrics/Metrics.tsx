import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import gql from 'graphql-tag';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 150,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const query = gql`
{
  getMetrics
}
`;

const getMetrics = (state: IState) => {
  const { metricList } = state.metrics;
  return {
    metricList
  }
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics:FunctionComponent<{ initial?: string}> = ({ initial = ''}) => {
  const classes = useStyles();
  const [metricName, setSelectedMetrics] = React.useState<string[]>([]);
  const dispatch = useDispatch();
  const { metricList } = useSelector(getMetrics);

  //Get graphql data for metric getMetrics which 
  //returns a list of metric categories
  const [result] = useQuery({
    query
  });

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricListDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  //handle multiple select change
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetrics(event.target.value as string[]);
    dispatch(actions.metricListUpdate(event.target.value as string[]));
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={metricName}
        onChange={handleChange}
        input={<Input />}
        renderValue={selected => (selected as string[]).join(', ')}
        MenuProps={MenuProps}
      >
        {metricList.map((metric: string) => (
          <MenuItem key={metric} value={metric}>
            <Checkbox checked={metricName.indexOf(metric) > -1} />
            <ListItemText primary={metric} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    );
};