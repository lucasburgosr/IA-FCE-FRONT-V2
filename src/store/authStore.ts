import { persist } from 'zustand/middleware'
import { create } from 'zustand'

interface AuthState {
    token: string | null,
    emailUsuario: string | null,
    usuario_id: number | null

    setAuth: (token: string, emailUsuario: string, usuario_id: number) => void;
    clearAuth: () => void
}

export const useAuthStore = create<AuthState, [["zustand/persist", AuthState]]>(
    persist(
        (set) => ({
            token: null,
            emailUsuario: null,
            usuario_id: null,
            setAuth: (token: any, emailUsuario: any, usuario_id: any) => set({token, emailUsuario, usuario_id}),
            clearAuth: () => set({token: null, emailUsuario: null, usuario_id: null})
        }),
        {
            name: 'auth-storage',
        }
    )
)