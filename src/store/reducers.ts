import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as metricCardReducer } from '../Features/MetricCard/reducer';
import { reducer as metricGraphReducer } from '../Features/MetricGraph/reducer';
import { reducer as testReducer } from '../Features/Test/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  metricCard: metricCardReducer,
  metricGraph: metricGraphReducer,
  test: testReducer,
};
