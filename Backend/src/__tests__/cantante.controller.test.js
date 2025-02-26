import {describe, expect, jest} from "@jest/globals";

jest.unstable_mockModule('../Modelos/cantanteModelos.js', ()=>({
    default:{
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    },
}));

const {listarCantantes,obtenerCantante,actualizarCantante,eliminarCantante} = await import("../Controladores/cantanteController.js");

const Cantante =(await import("../Modelos/cantanteModelos.js")).default;

describe("LISTAR CANTANTES", () =>{
    const mockCantantes =[
            {
               cantante:"lewis capildi",
               canciones:"before you go",
               avatar: "..."
            },
            {
                cantante:"feid",
                canciones:"CRUZ",
                avatar:"...",
            }
        ];
    it("Deberia listar todos los cantantes", async () =>{
        
        Cantante.find.mockResolvedValue(mockCantantes);

        const req={};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await listarCantantes(req,res);
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockCantantes)
    });
    it("Deberia de dar error status 500 al intentar listar los cantantes",async () =>{
        Cantante.find.mockRejectedValue(mockCantantes);

        const req={};
        const res={
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await listarCantantes(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message:"Error al obtener los cantantes"
        });
    })
});
describe("OBTENER CANTANTE", ()=>{
    const mockCantante =[
        {
           cantante:"lewis capildi",
           canciones:"before you go",
           avatar: "..."
        },
    ]
it("Deberia de obtener un cantante", async () =>{
    Cantante.findById.mockResolvedValue(mockCantante);

    const req = { params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" } };
    const res ={
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await obtenerCantante(req,res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCantante);
});
it("Deberia de retornar ID no valido al intentar buscar un cantante", async () =>{
    Cantante.findById.mockResolvedValue(mockCantante);

    const req ={params:{id:""}};
    const res ={
        status: jest.fn().mockReturnThis(),
        json:jest.fn(),
    };

    await obtenerCantante(req,res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "ID no válido"
    });
});
it("Deberia de retornar Cantante no encontrado", async ()=>{
    Cantante.findById.mockResolvedValue();

    const req ={params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" }};
    const res ={
        status: jest.fn().mockReturnThis(),
        json:jest.fn(),
    };

    await obtenerCantante(req,res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
        message: "Cantante no encontrado"
    });
});
it("Deberia de retornar Error interno del servidor", async () =>{
    Cantante.findById.mockRejectedValue(mockCantante);

    const req ={params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" }};
    const res ={
        status: jest.fn().mockReturnThis(),
        json:jest.fn(),
    };

    await obtenerCantante(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        message:"Error interno del servidor"
    });
})
});
describe("ACTUALIZAR CANTANTE", ()=>{
    const mockCantante =[
            {
                id:"123123",
               cantante:"lewis capildi",
               canciones:"before you go",
               avatar: "..."
            },
        ];
        
        it("Debería actualizar el cantante", async () => {
            const mockCantante = {
                _id: "123123",
                name: "Lewis Capaldi",
                canciones: ["Before You Go", "Let Me Down"],
                avatar: "...",
            };
        
            // Simula que el cantante fue encontrado y actualizado
            Cantante.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCantante);
        
            const req = {
                params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" },
                body: {
                    name: "Lewis Capaldi",
                    canciones: ["Before You Go", "Let Me Down"],
                    avatar: "...",
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
        
            await actualizarCantante(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Cantante actualizado con éxito",
                cantante: mockCantante,
            });
        });
})