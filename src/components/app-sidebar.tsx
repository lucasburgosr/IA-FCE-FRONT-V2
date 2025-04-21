"use client"

import { useEffect, useCallback } from "react"
import axios from "axios"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Home, Inbox, Settings, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useAsistenteStore } from "@/store/asistenteStore"
import { useAlumnoStore } from "@/store/alumnoStore"
import type Alumno from "@/types/Alumno"
import { useNavigate } from "react-router-dom"

const menuItems = [
    { title: "Tutor FCE", url: "/chat", icon: Home },
    { title: "Evaluaciones", url: "#", icon: Inbox },
    { title: "Ajustes", url: "#", icon: Settings },
    { title: "Cerrar sesión", url: "#", icon: LogOut },
]

export function AppSidebar() {
    // — Store selectors —
    const alumnoId = useAuthStore(s => s.usuario_id)
    const alumno = useAlumnoStore(s => s.alumno)
    const clearAuth = useAuthStore(s => s.clearAuth)
    const clearAlumno = useAlumnoStore(s => s.clearAlumno)
    const clearAsistente = useAsistenteStore(s => s.clearAsistente)
    const setAlumno = useAlumnoStore(s => s.setAlumno)
    const setAsistenteId = useAsistenteStore(s => s.setAsistenteId)
    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_API_URL
    const token = localStorage.getItem("token") ?? ""

    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token")

        clearAlumno()
        clearAuth()
        clearAsistente()

        navigate("/login")
    }, [])

    const fetchAlumno = useCallback(async () => {
        try {
            const res = await axios.get<Alumno>(
                `${apiUrl}/alumnos/${alumnoId}`,
                axiosConfig
            )
            setAlumno(res.data)
        } catch (err) {
            console.error("Error al obtener alumno:", err)
        }
    }, [apiUrl, alumnoId, axiosConfig, setAlumno])

    useEffect(() => {
        if (alumnoId) fetchAlumno()
            console.log("Este está imprimiendo")
    }, [alumnoId])

    const handleSelectAsistente = useCallback((id: string) => {
        setAsistenteId(id)
    }, [setAsistenteId])

    return (
        <Sidebar>
            <SidebarContent className="pl-3.5">
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="justify-center space-y-4">
                            {/* Selector de Asistente */}
                            <Select onValueChange={handleSelectAsistente}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Elige un asistente…" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {alumno?.asistentes.map(a => (
                                        <SelectItem
                                            key={a.asistente_id}
                                            value={a.asistente_id}
                                        >
                                            {a.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Resto del menú */}
                            {menuItems.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {item.title === "Cerrar sesión" ? (
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 w-full text-left"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </button>
                                        ) : (
                                            <a
                                                href={item.url}
                                                className="flex items-center space-x-2"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
