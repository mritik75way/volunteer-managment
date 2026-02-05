import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

export interface Shift {
  _id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  filled: number;
}

export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: 'open' | 'closed';
  shifts: Shift[];
  requiredSkills?: string[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  matchScore?: number;
  isBestMatch?: boolean;
}

interface OpportunitiesState {
  list: Opportunity[];
  isLoading: boolean;
}

const initialState: OpportunitiesState = {
  list: [],
  isLoading: false,
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    setOpportunities: (state, action: PayloadAction<Opportunity[]>) => {
      state.list = action.payload;
      state.isLoading = false;
    },
    addOpportunity: (state, action: PayloadAction<Opportunity>) => {
      state.list.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setOpportunities, addOpportunity, setLoading } = opportunitiesSlice.actions;
export default opportunitiesSlice.reducer;