import Asistente from "./Asistente"
import Evaluacion from "./Evaluacion"
import Pregunta from "./Pregunta"
import Thread from "./Thread"

export default interface Alumno {
    email: string
    nombres: string
    apellido: string
    firebase_uid: string | null
    id: number
    last_login: Date
    asistentes: Asistente[]
    preguntas: Pregunta[]
    threads: Thread[]
    evaluaciones: Evaluacion[]
}