import React, { FunctionComponent } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

// const useStyles = makeStyles({
//     card: {
//       margin: '1% 10%',
//     },
// });

type CardProps = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

export default ({ metric = "", at = 0, value = 0, unit = "" }) => {
  return (
      <MetricCardData metric={metric} at={at} value={value} unit={unit} />
  );
};

const MetricCardData: FunctionComponent<CardProps> = ({ metric = '', at = 0, value = 0, unit = "" }) => {
  // const classes = useStyles();

  return (
    <div>
      {metric !== "" && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              {metric}
            </Typography>
            <Typography variant="body2" component="p">
              {value} 
              {' '}
              {unit}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
