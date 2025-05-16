"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Alumno from "@/types/Alumno"

type Props = {
    alumno: Alumno
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AlumnoStatsModal({ alumno, open, onOpenChange }: Props) {
    const [filtro, setFiltro] = useState<"unidad" | "subtema">("unidad")
    const [seleccionado, setSeleccionado] = useState<string | null>(null)

    const preguntas = alumno.preguntas || []

    const agrupadas = preguntas.reduce<Record<string, number>>((acc, p) => {
        const key = filtro === "unidad" ? p.unidad.nombre : p.subtema.nombre
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})

    const opciones = Object.keys(agrupadas)

    const filtradas = seleccionado
        ? preguntas.filter(p =>
            filtro === "unidad"
                ? p.unidad.nombre === seleccionado
                : p.subtema.nombre === seleccionado
        )
        : []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-white">
                <DialogHeader>
                    <DialogTitle>
                        Estadísticas de {alumno.nombres} {alumno.apellido}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 mb-4">
                    <Select
                        value={filtro}
                        onValueChange={(v) => {
                            setFiltro(v as "unidad" | "subtema")
                            setSeleccionado(null)
                        }}
                    >
                        <SelectTrigger className="w-40 bg-white">
                            <SelectValue placeholder="Filtrar por" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="unidad">Por unidad</SelectItem>
                            <SelectItem value="subtema">Por subtema</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* <Select
                        value={seleccionado ?? ""}
                        onValueChange={(v) => setSeleccionado(v)}
                    >
                        <SelectTrigger className="w-60 bg-white">
                            <SelectValue placeholder={`Seleccionar ${filtro}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {opciones.map(op => (
                                <SelectItem key={op} value={op}>
                                    {op}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}
                </div>

                {!seleccionado ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{filtro === "unidad" ? "Unidad" : "Subtema"}</TableHead>
                                <TableHead className="text-right">Preguntas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {opciones.map(nombre => (
                                <TableRow key={nombre}>
                                    <TableCell>{nombre}</TableCell>
                                    <TableCell className="text-right">{agrupadas[nombre]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div>
                        <h4 className="mb-2 font-semibold text-sm">
                            Preguntas de {seleccionado}:
                        </h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                            {filtradas.map(p => (
                                <li key={p.pregunta_id}>{p.contenido}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
