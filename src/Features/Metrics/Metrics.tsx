import React, { FunctionComponent, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from "@material-ui/core/LinearProgress";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import gql from 'graphql-tag';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import { IState } from '../../store';
import { actions } from "./reducer";
import { useQuery } from "react-apollo-hooks";

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

const getMetrics = (state: IState) => {
  const { metricList } = state.metrics;
  return {
    metricList,
  };
};

// export default () => {
//   return (
//       <Metrics />
//   )
// };

const Metrics: FunctionComponent<{ initial?: string }> = ({ initial = "" }) => {

  const classes = useStyles();
  const [metricName, setSelectedMetrics] = React.useState<string[]>([]);
  const dispatch = useDispatch();
  const { metricList } = useSelector(getMetrics);

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
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricListDataRecevied(getMetrics));
  }, [data, error]);

  if (loading) return <LinearProgress />;

  // handle multiple select change
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetrics(event.target.value as string[]);
    dispatch(actions.metricListUpdate(event.target.value as string[]));
  };

  console.log('Metrics rendered', actions);
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
export default memo(Metrics);