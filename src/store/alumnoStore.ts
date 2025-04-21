// src/store/alumnoStore.ts
import { create } from 'zustand'
import Alumno from '@/types/Alumno'

interface AlumnoState {
  alumno: Alumno | null
  setAlumno:   (alumno: Alumno) => void
  clearAlumno: () => void
}

export const useAlumnoStore = create<AlumnoState>((set) => ({
  alumno: null,

  setAlumno: (alumno) => set({ alumno }),

  clearAlumno: () => set({ alumno: null }),
}))
