// Compatible con Node.js 18+ o si usás node-fetch
import { config } from 'dotenv';
import nodeFetch from 'node-fetch';

config();

const fetch = globalThis.fetch || nodeFetch;

/**
 * Descarga una imagen desde una URL y la convierte a base64.
 * @param imageUrl URL pública de la imagen (ej: https://...)
 * @param mimeType Tipo MIME esperado (ej: image/jpeg, image/png)
 * @returns String base64 con prefijo data:...
 */
export async function imageUrlToBase64(imageUrl: string, mimeType = 'image/jpeg'): Promise<string> {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`❌ Error al descargar imagen: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('❌ Error en imageUrlToBase64:', error);
    throw error;
  }
}