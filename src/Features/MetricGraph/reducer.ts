import { createSlice, PayloadAction } from 'redux-starter-kit';

//Array of metric cards
export type MetricGraph = {
  metric: string,
  measurements: [
      {
        metric: string,
        value: number,
        at: number,
        unit: string,
      }
    ]
};

export type ApiErrorAction = {
  error: string;
};

//Array of metric cards
const initialState = {
  metric: '',
  measurements: [
      {
        metric: '',
        value: 0,
        at: 0,
        unit: '',
      }
    ]
};

const slice = createSlice({
  name: 'metricGraph',
  initialState,
  reducers: {
    metricGraphDataRecevied: (state, action: PayloadAction<any>) => {
      state.measurements = action.payload;
      //state.graphData = action.payload.reduce((acc:any[], item:any) => acc.concat(item.measurements),[]);
    },
    metricGraphApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
