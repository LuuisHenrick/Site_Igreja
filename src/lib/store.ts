import { create } from 'zustand';
import { membersApi, assetsApi, mediaApi, financialApi, eventsApi, educationApi } from './api';

// Keep existing interfaces...

interface ChurchState {
  members: Member[];
  assets: Asset[];
  mediaFiles: MediaFile[];
  financialRecords: FinancialRecord[];
  events: Event[];
  educationEvents: EducationEvent[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  
  // Other actions...
}

export const useStore = create<ChurchState>((set, get) => ({
  members: [],
  assets: [],
  mediaFiles: [],
  financialRecords: [],
  events: [],
  educationEvents: [],
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    try {
      set({ isLoading: true, error: null });
      const [
        members,
        assets,
        mediaFiles,
        financialRecords,
        events,
        educationEvents
      ] = await Promise.all([
        membersApi.getAll(),
        assetsApi.getAll(),
        mediaApi.getAll(),
        financialApi.getAll(),
        eventsApi.getAll(),
        educationApi.getAll()
      ]);

      set({
        members,
        assets,
        mediaFiles,
        financialRecords,
        events,
        educationEvents,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      });
    }
  },

  // Keep existing actions...
}));