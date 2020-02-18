import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Test = {
  testList: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  testList: [''],
};

const slice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    testDataRecevied: (state, action: PayloadAction<string[]>) => {
      state.testList = action.payload;
    },
    testApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => {
    },
    testUpdate: (state, action: PayloadAction<string[]>) => {

    },
    testTest: (state, action: PayloadAction<string[]>) => {
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
