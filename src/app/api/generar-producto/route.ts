import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      imagenBase64,
      tipo,
      material,
      color,
      dimensiones,
      estilo,
      detallesAdicionales,
    } = await req.json();

    // Validación de campos obligatorios
    if (!imagenBase64) {
      return NextResponse.json(
        { error: "La imagen en base64 es obligatoria" },
        { status: 400 }
      );
    }

    if (!tipo || !material || !color) {
      return NextResponse.json(
        { error: "Tipo, material y color son campos obligatorios" },
        { status: 400 }
      );
    }

    console.log(`Generando descripción de producto: ${tipo}`);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const prompt = `
            Actúa como un experto en copywriting para e-commerce de lujo y productos premium.
            Tu tarea es generar el nombre, descripción y especificaciones de un producto basándote en la imagen proporcionada y los datos técnicos.

            DATOS DEL PRODUCTO:
            - Tipo: ${tipo}
            - Material: ${material}
            - Color: ${color}
            - Dimensiones: ${dimensiones || "No especificado"}
            - Estilo: ${estilo || "Moderno"}
            - Detalles adicionales: ${detallesAdicionales || "Ninguno"}

            REGLAS CRÍTICAS:
            1. El nombre debe ser corto (máximo 8 palabras).
            2. La descripción debe tener EXACTAMENTE 2 párrafos.
            3. Párrafo 1: Emocional y elegante.
            4. Párrafo 2: Técnico y detallado.
            5. Responde ÚNICAMENTE en JSON.

            FORMATO JSON:
            {"nombre":"Nombre","descripcion":"Párrafo 1.\\n\\nPárrafo 2.","especificaciones":["Esp 1","Esp 2"]}
            `;

    const requestPayload = [
      prompt,
      {
        inlineData: {
          data: imagenBase64,
          mimeType: "image/jpeg",
        },
      },
    ];

    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    };

    let result;
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig,
      });
      result = await model.generateContent(requestPayload);
    } catch (err) {
      console.warn(
        "Fallo con gemini-2.5-flash, reintentando con gemini-2.0-flash...",
        err
      );
      try {
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig,
        });
        result = await fallbackModel.generateContent(requestPayload);
      } catch (err2) {
        console.warn(
          "Fallo con gemini-2.0-flash, reintentando con modelo lite...",
          err2
        );
        const liteModel = genAI.getGenerativeModel({
          model: "gemini-2.5-flash-lite",
          generationConfig,
        });
        result = await liteModel.generateContent(requestPayload);
      }
    }

    const response = await result.response;
    const text = response.text();

    console.log("Respuesta recibida de Gemini correctamente.");
    console.log("Raw output de Gemini:", text);

    const parsedResponse = JSON.parse(text);

    return NextResponse.json(parsedResponse, { status: 200 });
  } catch (error) {
    console.error("Error en API de generación de producto:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    // Si el error es de cuota (429), enviamos un mensaje más amigable
    if (errorMessage.includes("429")) {
      return NextResponse.json(
        {
          error:
            "Has alcanzado el límite de peticiones gratuitas por minuto de la IA. Por favor, espera 1 minuto y vuelve a intentarlo.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Error al generar la descripción del producto",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
