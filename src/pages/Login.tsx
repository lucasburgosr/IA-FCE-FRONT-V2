import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL

  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    try {
      
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password
      });

      const { token, usuario_id } = response.data;

      localStorage.setItem("token", token)

      setAuth(token, email, usuario_id)

      navigate("/chat")

    } catch(error: any) {
      setErrorMsg(error.response?.data?.detail || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-sm border border-gray-300 rounded-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido al Tutor IA</CardTitle>
          <CardDescription className="text-gray-500">
            Inicia sesión para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <Button 
              type="submit" 
              className="w-full mt-2 bg-red-700 hover:bg-red-800 text-white"
              loading={loading}
            >
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta? <a href="/registro" className="text-blue-500">Regístrate</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export { Login }