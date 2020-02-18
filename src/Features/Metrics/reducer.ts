import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  metricList: string[];
  selectedMetricList: string[];
  selectedMetricListMetricCard: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricList: [''],
  selectedMetricList: [''],
  selectedMetricListMetricCard: [''],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricListDataRecevied: (state, action: PayloadAction<string[]>) => {
      console.log(action);
      state.metricList = action.payload;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => {
      console.log(action);
    },
    metricListUpdate: (state, action: PayloadAction<string[]>) => {
      state.selectedMetricList = action.payload;
    },
    metricListMetricCardUpdate: (state, action: PayloadAction<string[]>) => {
      state.selectedMetricListMetricCard = action.payload;
    },
    metricTest: (state, action: PayloadAction<string[]>) => {
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
