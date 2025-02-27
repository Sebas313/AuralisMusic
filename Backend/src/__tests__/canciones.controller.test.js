import { describe, expect, it, jest } from "@jest/globals";
import mongoose from "mongoose";

jest.unstable_mockModule("../Modelos/cancionesModelos.js", () => ({
  default: {
    finOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const{buscarOCrearCantante, ObtenerTodas,ObtenerPorId,Actualizar,Eliminar} = await import("../Controladores/cancionesController.js");

const Canciones = (await import ("../Modelos/cancionesModelos.js")).default;

describe("LISTAR CANCIONES", () =>{
    const mockCanciones = [
        {
        cantante: "Feid",
        cancion:"CRUZ",
        album:"ferxocalipsis",
        genero:"regueton",
        imagen:"...",
        fileUrl:"...",
    },
    {
        cantante: "Celia Cruz",
        cancion:"rata de dos patas",
        album:"1900",
        genero:"salsa",
        imagen:"...",
        fileUrl:"...",
    }
]
    it("Deberia de traer todas las canciones",async () =>{
        Canciones.find.mockResolvedValue(mockCanciones);

        const req ={};
        const res ={
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await ObtenerTodas(req,res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCanciones)
    })
})