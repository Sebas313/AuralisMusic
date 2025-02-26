import { describe, expect, it, jest } from "@jest/globals";
import mongoose from "mongoose";

jest.unstable_mockModule("../Modelos/cantanteModelos.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const {
  listarCantantes,
  obtenerCantante,
  actualizarCantante,
  eliminarCantante,
} = await import("../Controladores/cantanteController.js");

const Cantante = (await import("../Modelos/cantanteModelos.js")).default;

describe("LISTAR CANTANTES", () => {
  const mockCantantes = [
    {
      cantante: "lewis capildi",
      canciones: "before you go",
      avatar: "...",
    },
    {
      cantante: "feid",
      canciones: "CRUZ",
      avatar: "...",
    },
  ];
  it("Deberia listar todos los cantantes", async () => {
    Cantante.find.mockResolvedValue(mockCantantes);

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await listarCantantes(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCantantes);
  });
  it("Deberia de dar error status 500 al intentar listar los cantantes", async () => {
    Cantante.find.mockRejectedValue(mockCantantes);

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await listarCantantes(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al obtener los cantantes",
    });
  });
});
describe("OBTENER CANTANTE", () => {
  const mockCantante = [
    {
      cantante: "lewis capildi",
      canciones: "before you go",
      avatar: "...",
    },
  ];
  it("Deberia de obtener un cantante", async () => {
    Cantante.findById.mockResolvedValue(mockCantante);

    const req = { params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await obtenerCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCantante);
  });
  it("Deberia de retornar ID no valido al intentar buscar un cantante", async () => {
    Cantante.findById.mockResolvedValue(mockCantante);

    const req = { params: { id: "" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await obtenerCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "ID no válido",
    });
  });
  it("Deberia de retornar Cantante no encontrado", async () => {
    Cantante.findById.mockResolvedValue();

    const req = { params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await obtenerCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cantante no encontrado",
    });
  });
  it("Deberia de retornar Error interno del servidor", async () => {
    Cantante.findById.mockRejectedValue(mockCantante);

    const req = { params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await obtenerCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
    });
  });
});
describe("ACTUALIZAR CANTANTE", () => {
  const mockCantante = [
    {
      id: "123123",
      cantante: "lewis capildi",
      canciones: "before you go",
      avatar: "...",
    },
  ];

  it("Debería actualizar el cantante", async () => {
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
  it("Deberia de tirar ID no valido al intentar actualizar el cantante", async () => {
    Cantante.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCantante);

    const req = {
      params: { id: "" },
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
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "ID no válido",
    });
  });
  it("Deberia de tirar Cantante no encontrado al intentar actualizar el cantante", async () => {
    Cantante.findByIdAndUpdate = jest.fn().mockResolvedValue();

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
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cantante no encontrado",
    });
  });
  it("Deberia de lanzar erro del servidor al intentar actualizar el cantante", async () => {
    Cantante.findByIdAndUpdate = jest.fn().mockRejectedValue(mockCantante);

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
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
    });
  });
});
describe("ELIMINAR CANTANTE", () => {
  const mockCantante = [
    {
      id: "123123",
      cantante: "lewis capildi",
      canciones: "before you go",
      avatar: "...",
    },
  ];
  it("Debería de eliminar el cantante", async () => {
    const validId = new mongoose.Types.ObjectId().toString();

    // Simula que el cantante fue encontrado y eliminado
    Cantante.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: validId });

    const req = {
      params: { id: validId }, // Usa un ID válido
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eliminarCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cantante eliminado con éxito",
    });
  });
  it("Deberia de lanzar error ID no valido", async () => {
    Cantante.findByIdAndDelete = jest
      .fn()
      .mockResolvedValue({ _id: "65d9b1f2e4b0a3f4c5e6d7e8" });

    const req = {
      params: { id: "1" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eliminarCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "ID no válido",
    });
  });
  it("Deberia de lanzar error por no encontrar el cantante", async () => {
    Cantante.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const req = {
      params: { id: "65d9b1f2e4b0a3f4c5e6d7e8" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eliminarCantante(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cantante no encontrado",
    });
  });
  it("Debería lanzar error interno del servidor", async () => {
    Cantante.findByIdAndDelete = jest.fn().mockRejectedValue(null);

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    try {
        await Cantante.findByIdAndDelete(req.params.id);
    } catch (error) {
        console.log("Mock findByIdAndDelete lanzó error:", error);
    }

    await eliminarCantante(req, res);

    console.log("Status llamado con:", res.status.mock.calls);
    console.log("JSON llamado con:", res.json.mock.calls);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error interno del servidor" });
});

});
