import { persist } from 'zustand/middleware'
import { create } from 'zustand'

interface AsistenteState {
    nombre: string | null,
    instructions: string | null,
    asistente_id: string | null,
}

export const useAsistenteStore = create<AsistenteState, [["zustand/persist", AsistenteState]]>(
    persist(
        (set) => ({
            nombre: null,
            instructions: null,
            asistente_id: null,
            setAsistente: (nombre: any, instructions: any, asistente_id: any) => set({nombre, instructions, asistente_id}),
            clearAsistente: () => set({nombre: null, instructions: null, asistente_id: null}),
        }),
        {
            name: 'asistente-storage'
        }
    )
)