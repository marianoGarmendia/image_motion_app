import { config } from 'dotenv';

config();

const fetch = globalThis.fetch || (await import('node-fetch')).default;
import fs from 'fs';

/**
 * Envía una imagen base64 a ImageDescriber.app y obtiene una respuesta generada por IA.
 *
 * @param base64Image Imagen codificada en base64 (con prefijo data:image/jpeg;base64,...)
 * @param prompt Pregunta o instrucción para la IA
 * @param lang Idioma (por ejemplo, "es" o "en")
 * @returns Contenido generado por la IA
 */
export async function describeImageWithFetch({
  base64Image,
  prompt = '¿Qué es este objeto? , sus caracteristicas, color, si tiene marcas, logos o letras, y su uso.',
  lang = 'es',
}: {
  base64Image: string;
  prompt?: string;
  lang?: string;
}): Promise<string> {
  const response = await fetch('https://api.imagedescriber.app/api/v1/generate_content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.IMAGE_DESCRIBE_API_KEY}`,
    },
    body: JSON.stringify({
      image: base64Image,
      prompt,
      lang,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`❌ Error al describir imagen: ${errorData}`);
  }

  const data = await response.json();
  return data.content;
}

/*
Respuesta de la API:

{
  "code": 0,
  "message": "éxito",
  "request_id": "cadena_única_de_id_de_solicitud",
  "data": {
    "content": "Contenido generado en formato Markdown"
  }
}
*/ 