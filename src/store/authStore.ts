import { persist } from 'zustand/middleware'
import { create } from 'zustand'

interface AuthState {
    token: string | null,
    emailUsuario: string | null,
    usuario_id: number | null,
    type: string | null

    setAuth: (token: string, emailUsuario: string, usuario_id: number, type: string) => void;
    clearAuth: () => void
}

export const useAuthStore = create<AuthState, [["zustand/persist", AuthState]]>(
    persist(
        (set) => ({
            token: null,
            emailUsuario: null,
            usuario_id: null,
            type: null,
            setAuth: (token: any, emailUsuario: any, usuario_id: any, type: any) => set({token, emailUsuario, usuario_id, type}),
            clearAuth: () => set({token: null, emailUsuario: null, usuario_id: null, type: null})
        }),
        {
            name: 'auth-storage',
        }
    )
)