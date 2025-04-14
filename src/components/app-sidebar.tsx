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

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import Asistente from "@/types/Asistente"
import { data } from "react-router-dom"


const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {

    const [asistentes, setAsistentes] = useState<Asistente[]>([])
    const [asistente, setAsistente] = useState<Asistente>()
    const apiUrl = import.meta.env.VITE_API_URL

    useEffect(() => {
        let cancelToken = axios.CancelToken.source()

        async function fetchAsistentes() {
            try {
                const response = await axios.get(`${apiUrl}/asistentes/`, {
                    cancelToken: cancelToken.token,
                });
                setAsistentes(response.data)
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request cerrada")
                } else  {
                    console.error("Error al obtener los asistentes: ", err)
                }
            }
        }
        fetchAsistentes()

        return () => {
            // Cancelar la petición si el componente se desmonta
            cancelToken.cancel();
          };
    },[])

    console.log(asistentes)

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="justify-center">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {asistentes.map((asistente) => (
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