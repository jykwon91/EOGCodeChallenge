import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  metricList: string[];
  selectedMetricList: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricList: [''],
  selectedMetricList: [''],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricListDataRecevied: (state, action: PayloadAction<string[]>) => {
      state.metricList = action.payload;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    metricListUpdate: (state, action: PayloadAction<string[]>) => {
      state.selectedMetricList = action.payload;
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
