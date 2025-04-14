import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";

export default function Layout () {
    return (
        <>
        <Navbar></Navbar>
        <div className="flex h-screen bg-gray-50">
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 p-4">
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
        </>
    );
};
