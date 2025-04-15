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
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import Alumno from "@/types/Alumno"

const items = [
    {
        title: "Tutor FCE",
        url: "/chat",
        icon: Home,
    },
    {
        title: "Evaluaciones",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Ajustes",
        url: "#",
        icon: Settings,
    },
    {
        title: "Cerrar sesión",
        url: "#",
        icon: Settings,
    }
]

export function AppSidebar() {

    const [alumno, setAlumno] = useState<Alumno>()
    const token = localStorage.getItem("token")
    const id = useAuthStore((state) => state.usuario_id)

    const apiUrl = import.meta.env.VITE_API_URL

    useEffect(() => {

        async function getAlumno() {
            const response = await axios.get(`${apiUrl}/alumnos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data)
            setAlumno(response.data)
        }

        getAlumno()

    }, [])

    const handleSelectAsistente = () => {

    }

    return (
        <Sidebar>
            <SidebarContent className="pl-3.5">
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="justify-center">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {alumno?.asistentes.map((asistente) => (
                                        <SelectItem key={asistente.asistente_id} value={asistente.asistente_id}>{asistente.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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