import Asistente from "./Asistente"
import Evaluacion from "./Evaluacion"
import Pregunta from "./Pregunta"
import Thread from "./Thread"

export default interface Alumno {
    email: string
    firebase_uid: string | null
    id: number
    last_login: Date
    asistentes: Asistente[]
    preguntas: Pregunta[]
    thread: Thread[]
    evaluaciones: Evaluacion[]
}