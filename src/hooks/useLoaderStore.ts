'use client'

import { create } from 'zustand'

export interface LoaderState {
  progress: number
  phase: 'initializing' | 'loading' | 'revealing' | 'complete'
  isAudioReady: boolean
  hasInteracted: boolean
  loadingStartTime: number
  estimatedDuration: number
}

interface LoaderStore extends LoaderState {
  setProgress: (progress: number) => void
  setPhase: (phase: LoaderState['phase']) => void
  setAudioReady: (ready: boolean) => void
  setHasInteracted: (interacted: boolean) => void
  reset: () => void
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  progress: 0,
  phase: 'initializing',
  isAudioReady: false,
  hasInteracted: false,
  loadingStartTime: Date.now(),
  estimatedDuration: 3500,

  setProgress: (progress) =>
    set((state) => {
      const phase = progress === 100 ? 'revealing' : 'loading'
      return { progress: Math.min(100, progress), phase }
    }),

  setPhase: (phase) => set({ phase }),

  setAudioReady: (ready) => set({ isAudioReady: ready }),

  setHasInteracted: (interacted) => set({ hasInteracted: interacted }),

  reset: () =>
    set({
      progress: 0,
      phase: 'initializing',
      isAudioReady: false,
      hasInteracted: false,
      loadingStartTime: Date.now(),
    }),
}))

export default useLoaderStore
