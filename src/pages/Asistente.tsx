"use client"

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AsistenteOpenAI } from "@/types/AsistenteOpenAI"
import { useAsistenteStore } from "@/store/asistenteStore"

export function AsistenteEdit() {
  const navigate = useNavigate()
  const asistenteId = useAsistenteStore((s) => s.asistente_id)
  const apiUrl = import.meta.env.VITE_API_URL

  // Datos del asistente
  const [asistente, setAsistente] = useState<AsistenteOpenAI | null>(null)
  const [name, setName] = useState("")
  const [baseInstructions, setBaseInstructions] = useState("") // prompt original
  const [instructions, setInstructions] = useState("")         // prompt editable

  // Builder: nivel de estudiante
  const [nivel, setNivel] = useState<"Principiante" | "Intermedio" | "Avanzado">("Principiante")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch inicial
  useEffect(() => {
    setLoading(true)
    axios
      .get<AsistenteOpenAI>(`${apiUrl}/asistentes/${asistenteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(({ data }) => {
        setAsistente(data)
        setName(data.name)
        setBaseInstructions(data.instructions)
        setInstructions(data.instructions)
      })
      .catch((err) => setError(`No se pudo cargar el asistente: ${err}`))
      .finally(() => setLoading(false))
  }, [apiUrl, asistenteId])

  // Cada vez que cambie el nivel, regenero el prompt borrador
  useEffect(() => {
    if (!baseInstructions) return
    const borrador = [
      baseInstructions.trim(),
      `\n\n— Nivel de estudiante: ${nivel}.`,
    ].join("")
    setInstructions(borrador)
  }, [nivel, baseInstructions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await axios.put(
        `${apiUrl}/asistentes/${asistenteId}`,
        { name, instructions },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      navigate("/asistente")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al actualizar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {asistente ? "Editar Asistente" : "Cargando..."}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="name">Nombre del Asistente</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Selector de nivel */}
            <div className="flex flex-col space-y-1">
              <fieldset className="space-y-1">
                <legend className="block text-sm font-medium text-gray-700">
                  Nivel del estudiante
                </legend>
                <RadioGroup
                  value={nivel}
                  onValueChange={(v) => setNivel(v as any)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Principiante" id="lvl-1" />
                    <Label htmlFor="lvl-1">Principiante</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermedio" id="lvl-2" />
                    <Label htmlFor="lvl-2">Intermedio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Avanzado" id="lvl-3" />
                    <Label htmlFor="lvl-3">Avanzado</Label>
                  </div>
                </RadioGroup>
              </fieldset>
            </div>

            {/* Prompt borrador (editable) */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="instructions">Prompt del Asistente</Label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                disabled={loading}
                className="block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                rows={8}
              />
            </div>

            <CardFooter className="pt-4">
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-red-700 hover:bg-red-800 text-white"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
