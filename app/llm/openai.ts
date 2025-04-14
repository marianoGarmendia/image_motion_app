import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
import { log } from "three/tsl";
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
    const prompt = `crea un prompt especifico para describir una animación con klingAI donde el producto en cuestión haga una rotación suave de 90 grados, y que el video dure 6 a 8 segundos, manteniendo inalterable el fondo, el producto en el centro de la pantalla y  su forma y dimension originales, sin distorsion y sin elementos extra.
    
    Descripcion del producto: ${text}

    ### Regla estricta:
    - El background de la animación no debe cambiar, debe ser completamente neutro y liso, si tiene una sombra debjao del producto, debe ser la misma que la de la imagen original.
    - El producto no debe cambiar de color, ni de forma, ni de tamaño, ni de textura, ni de marca, ni de logo, ni de letras, ni de nada.
    `;

    console.log(`Prompt: ${prompt}`);
    
    try {
        const response = await model.invoke(prompt)
        console.log(`Respuesta: ${response.content}`);
        
        return response.content;
        
    } catch (error) {
        return `Error: ${error}`;
    }
  }