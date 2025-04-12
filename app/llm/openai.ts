import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
config(); // Cargar las variables de entorno desde el archivo .env

export const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    streaming: true,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
  })

  /**
 * Genera un prompt específico para describir una animación en KlingAI.
 *
 * @param text - Descripción del producto que se utilizará en el prompt.
 * @returns Una promesa que resuelve con el contenido generado por el modelo.
 */


  export const create_prompt_animation = async (text: string) => {
    const prompt = `crea un prompt especifico para describir una animación con klingAI donde el producto en cuestión haga una rotación suave de 90 grados, y que el video dure 6 a 8 segundos, mantenitendo el fondo y el producto en el centro de la pantalla y en su forma y dimension originales, sin distorsion y sin elementos extra.
    
    Descripcion del producto: ${text}
    `;
    try {
        const response = await model.invoke(prompt)
        return response.content;
        
    } catch (error) {
        return `Error: ${error}`;
    }
  }