"use client"

import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from "react"
import { useChat } from "ai/react"
import axios from "axios"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAsistenteStore } from "@/store/asistenteStore"
import { useAuthStore } from "@/store/authStore"
import { useAlumnoStore } from "@/store/alumnoStore"
import type Mensaje from "@/types/Mensaje"
import MessageList from "@/components/message-list"
import { useProfesorStore } from "@/store/profesorStore"

export default function Home() {
  // Estados y hooks
  const { input, setInput, handleInputChange } = useChat()
  const [messages, setMessages] = useState<Mensaje[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [creatingThread, setCreatingThread] = useState(false)

  const userType = useAuthStore(s => s.userType)
  const isProfesor = userType === "profesor"

  const asistenteId = useAsistenteStore(s => s.asistente_id)
  const setAsistenteId = useAsistenteStore(s => s.setAsistenteId)
  const alumnoId = useAuthStore(s => s.usuario_id)
  const alumno = useAlumnoStore(s => s.alumno)
  const profesor = useProfesorStore(s => s.profesor)

  const apiUrl = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token") ?? ""

  const [sesionId, setSesionId] = useState<number | null>(null)

  const axiosConfig = React.useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` }
    }),
    [token]
  )

 
  const threadId = alumno?.threads?.[0]?.id

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages]);


  useEffect(() => {
    if (isProfesor || !threadId || !asistenteId) return;

    (async () => {
      try {
        const res = await axios.post(
          `${apiUrl}/sesiones/iniciar/${alumnoId}`, { thread_id: threadId }, axiosConfig
        );
        setSesionId(res.data.sesion_id);
      } catch (err) {
        console.error("No se pudo iniciar la sesión:", err);
      }
    })();
  }, [threadId, asistenteId]);

  useEffect(() => {
    if (isProfesor && profesor?.materia?.asistente?.asistente_id) {
      setAsistenteId(profesor.materia.asistente.asistente_id)
    }
  }, [isProfesor, profesor])


  useEffect(() => {
    if (isProfesor || sesionId === null) return;

    const endSession = async () => {
      try {
        await axios.post(
          `${apiUrl}/sesiones/finalizar`,
          { alumno_id: alumnoId, sesion_id: sesionId, thread_id: threadId },
          axiosConfig
        );
      } catch (err) {
        console.error("Error finalizando la sesión:", err);
      }
    };

    return () => {
      endSession();
    };
  }, [sesionId]);

  useEffect(() => {
    if (!threadId || !asistenteId) return

    const fetchMensajes = async () => {
      try {
        const res = await axios.get<Mensaje[]>(
          `${apiUrl}/threads/${threadId}/messages`,
          axiosConfig
        )
        setMessages(res.data)
      } catch (err) {
        console.error("Error fetching mensajes:", err)
      }
    }

    fetchMensajes()
  }, [threadId, asistenteId, apiUrl, axiosConfig])

  const handleCreateThread = useCallback(async () => {
    if (!asistenteId) return
    setCreatingThread(true)
    try {
      const res = await axios.post(
        `${apiUrl}/threads/`,
        { alumnoId, asistente_id: asistenteId },
        axiosConfig
      )
      if (Array.isArray(res.data?.messages)) {
        setMessages(res.data.messages)
      }
    } catch (err) {
      console.error("No se pudo crear el thread:", err)
    } finally {
      setCreatingThread(false)
    }
  }, [alumnoId, asistenteId, apiUrl, axiosConfig])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setInput("")
      const texto = input.trim()
      if (!texto || !threadId || !asistenteId) return

      const userMsg: Mensaje = {
        id: `u-${Date.now()}`,
        rol: "user",
        texto,
        fecha: new Date()
      }
      setMessages(prev => [...prev, userMsg])
      setIsTyping(true)

      const payload = {
        id: threadId,
        asistente_id: asistenteId,
        input: texto,
        ...(isProfesor ? {} : { alumno_id: alumnoId })
      }

      try {
        const res = await axios.post<Mensaje[]>(
          `${apiUrl}/threads/${threadId}`,
          payload,
          axiosConfig
        )
        setMessages(res.data)

      } catch (err) {
        console.error("Error submitting message:", err)
      } finally {
        setIsTyping(false)
      }
    },
    [input, threadId, asistenteId, apiUrl, axiosConfig]
  )

  if (!asistenteId) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">
          Seleccioná un asistente
        </p>
      </div>
    )
  }

  if (!threadId) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Inicia conversación para empezar el chat
        </p>
        <Button
          onClick={handleCreateThread}
          disabled={creatingThread}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg"
        >
          {creatingThread ? "Iniciando..." : "Iniciar conversación"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="flex-1 p-4 md:p-6 flex flex-col max-w-4xl mx-auto w-full">
        <Card className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg border-gray-200">
          <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={messagesContainerRef}>
            <MessageList messages={messages} isTyping={isTyping} />
          </div>
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <div className="flex-1 overflow-hidden rounded-lg border border-gray-300 focus-within:border-red-800 focus-within:ring-1 focus-within:ring-red-800">
                <textarea
                  className="w-full resize-none border-0 bg-transparent p-3 focus:outline-none focus:ring-0"
                  placeholder="Hacé una pregunta..."
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                disabled={isTyping || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  )
}
