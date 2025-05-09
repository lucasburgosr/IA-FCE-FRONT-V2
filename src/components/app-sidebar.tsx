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

import { Home, Bot, LogOut, User } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useAsistenteStore } from "@/store/asistenteStore"
import { useAlumnoStore } from "@/store/alumnoStore"
import type Alumno from "@/types/Alumno"
import { useNavigate } from "react-router-dom"
import { useProfesorStore } from "@/store/profesorStore"
import Profesor from "@/types/Profesor"

const menuItems = [
    { title: "Tutor FCE", url: "/chat", icon: Home },
    { title: "Alumnos", url: "/alumnos", icon: User },
    { title: "Asistente", url: "/asistente", icon: Bot },
    { title: "Cerrar sesión", url: "#", icon: LogOut },
]

export function AppSidebar() {
    // Store de usuario
    const usuarioId = useAuthStore(s => s.usuario_id)
    const userType = useAuthStore(s => s.userType)
    const clearAuth = useAuthStore(s => s.clearAuth)

    // Store de alumno
    const alumno = useAlumnoStore(s => s.alumno)
    const clearAlumno = useAlumnoStore(s => s.clearAlumno)
    const setAlumno = useAlumnoStore(s => s.setAlumno)

    // Store de profesor
    const setProfesor = useProfesorStore(s => s.setProfesor)

    // Store de asistente
    const clearAsistente = useAsistenteStore(s => s.clearAsistente)
    const setAsistenteId = useAsistenteStore(s => s.setAsistenteId)

    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const token = localStorage.getItem("token") ?? ""

    // Configuración de axios para requests
    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
    }

    // Handler para cerrar sesión
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token")

        clearAlumno()
        clearAuth()
        clearAsistente()

        navigate("/login")
    }, [])

    // Función que hace un GET al servidor para traer un usuario según sea profesor o alumno
    const fetchUsuario = useCallback(async () => {
        try {
            if (userType === "alumno") {
                const res = await axios.get<Alumno>(
                    `${apiUrl}/alumnos/${usuarioId}`,
                    axiosConfig
                )
                setAlumno(res.data)
            }
            if (userType === "profesor") {
                const res = await axios.get<Profesor>(
                    `${apiUrl}/profesores/${usuarioId}`,
                    axiosConfig
                )
                setProfesor(res.data)
                setAsistenteId(res.data.materia.asistente.asistente_id)
            }

        } catch (err) {
            console.error("Error al obtener el usuario:", err)
        }
    }, [apiUrl, usuarioId, axiosConfig, setAlumno, setProfesor])

    useEffect(() => {
        if (usuarioId) fetchUsuario()
    }, [usuarioId])

    //Handler para establecer el asistente a usar en el chatbot
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
                            {(alumno && userType === "alumno") && <Select onValueChange={handleSelectAsistente}>
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
                            </Select>}

                            {menuItems
                                .filter(item => {
                                    if (["Alumnos", "Asistente"].includes(item.title) && userType !== "profesor") {
                                        return false;
                                    } else if (["Tutor FCE"].includes(item.title) && userType !== "alumno"){
                                        return false
                                    }
                                    return true;
                                })
                                .map(item => (
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

                                            ) : item.title === "Alumnos" ? (
                                                /* Sólo llega aquí si userType==="profesor" */
                                                <a
                                                    href={item.url}
                                                    className="flex items-center space-x-2 w-full text-left"
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>

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
