import { createSlice, PayloadAction } from 'redux-starter-kit';

//Array of metric cards
export type MetricCard = {
    metric: string;
    at: number;
    value: number;
    unit: string;
};

export type ApiErrorAction = {
  error: string;
};


//Array of metric cards
const initialState = {
  metricCard: {
    metric: '',
    at: 0,
    value: 0,
    unit: '',
  },
  metricCardList: [{
    metric: '',
    at: 0,
    value: 0,
    unit: '',
  }]
};

const slice = createSlice({
  name: 'metricCard',
  initialState,
  reducers: {
    metricCardDataRecevied: (state, action: PayloadAction<MetricCard>) => {
      state.metricCardList.push(action.payload);
      const cardList = state.metricCardList;
      for (var i=0; i<cardList.length; i++) {
        if (cardList[i].metric === action.payload.metric) {
          cardList[i] = action.payload;
        }
      }
      state.metricCardList = cardList;
    },
    metricCardApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
