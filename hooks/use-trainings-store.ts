import { CreateTrainingRequest, TrainingSetCommandDTO } from '@/state/endpoints/api.schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface TrainingSetWithDetails extends TrainingSetCommandDTO {
  exerciseName: string;
}

interface TrainingState {
  currentTraining: {
    userId: string;
    trained: Date;
    sets: TrainingSetWithDetails[];
  } | null;
  
  initializeTraining: (userId: string) => void;
  addExerciseSets: (exerciseSets: TrainingSetCommandDTO[], exerciseName: string) => void;
  removeExerciseSet: (index: number) => void;
  updateExerciseSet: (index: number, updatedSet: TrainingSetWithDetails) => void;
  clearTraining: () => void;
  getCreateTrainingRequest: () => CreateTrainingRequest | null;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      currentTraining: null,

      initializeTraining: (userId: string) => {
        const current = get().currentTraining;
        if (!current || current.userId !== userId) {
          set({
            currentTraining: {
              userId,
              trained: new Date(),
              sets: []
            }
          });
        }
      },

      addExerciseSets: (exerciseSets: TrainingSetCommandDTO[], exerciseName: string, exerciseImageUrl?: string) => {
        const current = get().currentTraining;
        if (!current) {
          console.error('No active training session');
          return;
        }

        const setsWithDetails: TrainingSetWithDetails[] = exerciseSets.map(set => ({
          ...set,
          exerciseName,
          exerciseImageUrl
        }));

        set({
          currentTraining: {
            ...current,
            sets: [...current.sets, ...setsWithDetails]
          }
        });
      },

      removeExerciseSet: (index: number) => {
        const current = get().currentTraining;
        if (!current) return;

        const newSets = current.sets.filter((_, i) => i !== index);
        set({
          currentTraining: {
            ...current,
            sets: newSets
          }
        });
      },

      updateExerciseSet: (index: number, updatedSet: TrainingSetWithDetails) => {
        const current = get().currentTraining;
        if (!current) return;

        const newSets = [...current.sets];
        newSets[index] = updatedSet;
        set({
          currentTraining: {
            ...current,
            sets: newSets
          }
        });
      },

      clearTraining: () => {
        set({ currentTraining: null });
      },

      getCreateTrainingRequest: () => {
        const current = get().currentTraining;
        if (!current) return null;

        // for the api
        const apiSets: TrainingSetCommandDTO[] = current.sets.map(({ exerciseName, ...apiSet }) => apiSet);

        return {
          userId: current.userId,
          trained: current.trained,
          sets: apiSets.length > 0 ? apiSets : null
        };
      }
    }),
    {
      name: 'training-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);