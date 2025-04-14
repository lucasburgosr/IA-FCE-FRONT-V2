import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dni, setDni] = useState("");
    const [nombres, setNombres] = useState("")
    const [apellido, setApellido] = useState("")
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        setErrorMsg("");
        try {

            const passwordCheck = handleCheckPassword()

            if (!passwordCheck) {
                return;
            }


            // Llamada al endpoint de registro
            const response = await axios.post(`${apiUrl}/auth/register`, {
                email,
                password,
                dni,
                nombres,
                apellido
            });

            console.log("Registro exitoso:", response.data);
            navigate("/login");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.detail || "Error al registrar usuario");
        } finally {
            setLoading(false)
        }
    };

    const handleCheckPassword = (): boolean => {
        if (password != confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden")
            return false
        }
        setErrorMsg("")
        return true
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm shadow-sm border border-gray-300 rounded-lg p-6">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Regístrate en Tutor IA</CardTitle>
                    <CardDescription className="text-gray-500">
                        Completa el formulario para crear tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="nombres">Nombre</Label>
                            <Input
                                id="nombres"
                                type="text"
                                placeholder="Ingresa tu/s nombre/s"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                required
                            ></Input>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input
                                id="apellido"
                                type="text"
                                placeholder="Ingresa tu apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ingresa tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="confirmPassword">Repetir contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="dni">DNI</Label>
                            <Input
                                id="dni"
                                type="text"
                                placeholder="00000001"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                required
                            />
                        </div>
                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                        <Button type="submit" className="w-full mt-2 bg-red-700 hover:bg-red-800 text-white" loading={loading}>
                            Registrarse
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-gray-500">
                        ¿Ya tienes cuenta? <a href="/login" className="text-blue-500">Inicia sesión</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
