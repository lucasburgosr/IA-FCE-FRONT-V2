// src/pages/EditAssistantPage.tsx
import React, { useEffect, useState } from "react";
import { /* useParams, */ useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Asistente from "@/types/Asistente";
import { AsistenteOpenAI } from "@/types/AsistenteOpenAI";
import { useAsistenteStore } from "@/store/asistenteStore";

export function AsistenteEdit() {
  //const { asistente_id } = useParams<{ asistente_id: string }>();
  const navigate = useNavigate();

  const [Asistente, setAssistant] = useState<Asistente | AsistenteOpenAI | null>(null);
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const asistenteId = useAsistenteStore(s => s.asistente_id)
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {

    setLoading(true);
    axios
      .get<AsistenteOpenAI>(`${apiUrl}/asistentes/${asistenteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        setAssistant(data);
        setName(data.name);
        setInstructions(data.instructions);
      })
      .catch((err) => setError(`No se pudo cargar el asistente ${err}`))
      .finally(() => setLoading(false));
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    try {
      await axios.put(
        `${apiUrl}/asistentes/asst_LMnzwqHscAlIEBRRrWzB6myW`,
        {
          name: name,
          instructions: instructions
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      // Al terminar, redirigir o mostrar mensaje
      navigate("/asistente");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {Asistente ? `Editar` : "Cargando..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex flex-col space-y-1">
              <Label htmlFor="instructions">Instrucciones</Label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                disabled={loading}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                rows={6}
              />
            </div>
            <CardFooter className="pt-4">
              <Button type="submit" loading={loading} className="w-full mt-2 bg-red-700 hover:bg-red-800 text-white">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
