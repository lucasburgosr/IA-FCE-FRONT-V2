export default interface Thread {
    title: string | null
    id: number //Para identificar el thread en la base de datos
    thread_id: string // Para obtenerlo desde la API de OpenAI
    started_at: Date
    updated_at: Date
}