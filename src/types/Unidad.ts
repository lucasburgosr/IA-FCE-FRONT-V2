import Materia from "./Materia"
import Subtema from "./Subtema"

export default interface Unidad {
    nombre: string
    descripcion: string | null
    materia: Materia
    unidad_id: number
    subtemas: Subtema[]
}