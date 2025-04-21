export default interface Thread {
    title: string | null
    thread_id: string // Para obtenerlo desde la API de OpenAI
    started_at: Date
    updated_at: Date
}