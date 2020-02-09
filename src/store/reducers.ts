import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as metricCardReducer } from '../Features/MetricCard/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  metricCard: metricCardReducer,
};
