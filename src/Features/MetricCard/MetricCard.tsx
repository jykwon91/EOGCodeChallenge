import React from 'react';
import { useSelector } from 'react-redux';
import { createClient, Provider } from 'urql';
//import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { IState } from '../../store';

type CardProps = {
  metric: string,
  at: number,
  value: number,
  unit: string,
}
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

// const useStyles = makeStyles(theme => ({
//   title: {
//     fontSize: 14,
//   },
//   pos: {
//     marginBottom: 12,
//   },
// }));

export default () => {
  return (
    <Provider value={client}>
      <MetricCard />
    </Provider>
  );
};

const getSelectedMetrics = (state: IState) => {
  const { selectedMetricList } = state.metrics;
  return {
    selectedMetricList
  }
};

const getMetricCardList = (state: IState) => {
  const { metricCardList } = state.metricCard;
  return {
    metricCardList
  }
};

const MetricCard = () => {
  //const classes = useStyles();
  const { metricCardList } = useSelector(getMetricCardList);
  const { selectedMetricList } = useSelector(getSelectedMetrics);
  const distinct = (value:any, index:number, self:any[]) => {
    return self.indexOf(value) === index;
  }
  return (
    <Card>
      {metricCardList.filter((item)=>{return selectedMetricList.includes(item.metric)}).filter(distinct).map((item, i) => (
          <CardContent key={i}>
              <Typography variant="h5" component="h3">
                  {item.metric}
              </Typography>
              <Typography variant="body2" component="p">
                  {item.value} {item.unit}
              </Typography>
          </CardContent>
      ))}
    </Card>
    );
};