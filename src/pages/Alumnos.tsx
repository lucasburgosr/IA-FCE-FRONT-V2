// src/pages/Alumnos.tsx
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import Alumno from "@/types/Alumno"
import { ResumenCell } from "@/components/resumen-modal"

export function Alumnos() {
  const navigate   = useNavigate()
  const profesorId = useAuthStore(s => s.usuario_id)
  const token      = localStorage.getItem("token") ?? ""

  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const apiUrl = import.meta.env.VITE_API_URL

  const axiosConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token])

  useEffect(() => {
    if (!profesorId) {
      navigate("/login")
      return
    }
    setLoading(true)
    axios.get<Alumno[]>(
      `${apiUrl}/profesores/${profesorId}/alumnos`,
      axiosConfig
    )
    .then(res => {
      setAlumnos(res.data)
      setError(null)
    })
    .catch(err => {
      console.error(err)
      setError("No se pudieron cargar los alumnos.")
    })
    .finally(() => {
      setLoading(false)
    })
  }, [profesorId, axiosConfig, navigate])

  return (
    <div className="p-6">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Alumnos asignados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando alumnos…</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableCaption>Listado de alumnos que usan tus asistentes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Último inicio de sesión</TableHead>
                  <TableHead>Mensajes enviados</TableHead>
                  <TableHead>Tiempo de interacción</TableHead>
                  <TableHead>Última sesión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnos.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.apellido}</TableCell>
                    <TableCell>{a.nombres}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>
                      {new Date(a.last_login).toLocaleString()}
                    </TableCell>
                    <TableCell>{a.mensajes_enviados}</TableCell>
                    <TableCell>{a.tiempo_interaccion}</TableCell>
                    <ResumenCell resumen={a.resumen_ultima_sesion}></ResumenCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}