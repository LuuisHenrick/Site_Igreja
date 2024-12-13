import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { membersApi, assetsApi, mediaApi, financialApi, eventsApi, educationApi } from './api';
import { FinancialRecord } from "../types/FinancialRecord.ts";

interface ChurchState {
  members: Member[];
  assets: Asset[];
  mediaFiles: MediaFile[];
  financialRecords: FinancialRecord[];
  events: Event[];
  educationEvents: EducationEvent[];
  isLoading: boolean;
  error: string | null;
  toastMessage: { type: 'success' | 'error'; message: string } | null;
  
  // Actions
  setToastMessage: (message: { type: 'success' | 'error'; message: string } | null) => void;
  fetchInitialData: () => Promise<void>;
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => Promise<void>;
  deleteFinancialRecord: (id: string) => Promise<void>;
  
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
  toastMessage: null,
  
  setToastMessage: (message) => set({ toastMessage: message }),

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

  addFinancialRecord: async (record) => {
    try {
      const newRecord = await financialApi.create({
        ...record,
        id: uuidv4(),
      });
      set((state) => ({
        financialRecords: [...state.financialRecords, newRecord]
      }));
    } catch (error) {
      console.error('Error adding financial record:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add financial record' });
    }
  },

  deleteFinancialRecord: async (id) => {
    try {
      await financialApi.delete(id);
      set((state) => ({
        financialRecords: state.financialRecords.filter((r) => r.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting financial record:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete financial record' });
    }
  },

  // Other actions...
}));