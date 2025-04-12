import {config } from "dotenv";
// imageToVideo.js

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { log } from "console";
config(); // Cargar las variables de entorno desde el archivo .env
const form = new FormData(); // Crear un FormData para enviar los datos
const VIMMERSE_API_KEY = process.env.VIMMERSE_API_KEY || ""; // Reemplaza con tu API Key de Vimmerse
// import fetch from "node-fetch"; // Si usas node-fetch en Node.js

async function run({fileName}: { fileName: string }) {
    const imageUrl = `https://72jdmlb6-3500.brs.devtunnels.ms/images/${fileName}`;

    form.append("image_url", imageUrl); // Agregar la URL de la imagen al FormData
    form.append("option", "Image2Prompt"); // Agregar la opcion de IA
    form.append("prompt", "auricualres negros, marca JBL, en su estuche"); // Agregar el modelo de IA

    const resp = await fetch(
      `https://api.vimmerse.net/text/prompt`,
      {
        method: 'POST',
        headers: {
          'X-Api-Key': VIMMERSE_API_KEY,
        },
        // body: form,
      }
    );
  
    const data = await resp.text();
    console.log(data);
  }
  

  const image = "auri.jpg";

// (async () => {
//     await run({fileName: image})
    
// }) ()

// ----------------------------------------------------------------------------------

const IMAGINE_ART_API_KEY = process.env.IMAGINE_ART_API_KEY






async function createVideoTask(imagePath:string, prompt:string, style = 'kling-1.0-pro') {
  const form = new FormData();
  form.append('prompt', prompt);
  form.append('style', style);
//   form.append('aspect_ratio', aspectRatio);
  form.append('file', fs.createReadStream(imagePath));

  const headers = {
    
    Authorization: `Bearer ${IMAGINE_ART_API_KEY}`,
  };

  try {
    const response = await axios.post('https://api.vyro.ai/v2/video/image-to-video', form, { headers });
    const { id } = response.data;
    console.log(`🆔 Video ID recibido: ${id}`);
    return id;
  } catch (error:any) {
    console.error('❌ Error al crear la tarea de video:', error.response?.data || error.message);
    throw error;
  }
}

async function checkVideoStatus(videoId:string) {
    const headers = {
      Authorization: `Bearer ${IMAGINE_ART_API_KEY}`,
    };
  
    try {
      const response = await axios.get(`https://api.vyro.ai/v2/video/status/${videoId}`, { headers });
      return response.data;
    } catch (error:any) {
      console.error('❌ Error al consultar el estado del video:', error.response?.data || error.message);
      throw error;
    }
  }

  function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function waitForVideoReady(videoId:string, interval = 30000, maxAttempts = 30) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const statusData = await checkVideoStatus(videoId);
      const status = statusData.status;
      console.log(`🔁 Intento ${attempt}: Estado del video - ${status}`);
  
      if (status === 'success') {
        console.log('✅ Video procesado exitosamente.');
        return statusData.video.url.generation[0]; // URL del video generado
      }
  
      if (attempt < maxAttempts) {
        await sleep(interval);
      } else {
        throw new Error('⏱️ Tiempo de espera agotado. El video no se procesó a tiempo.');
      }
    }
  }

  async function downloadVideo(videoUrl:string, outputFileName:string) {
    const response = await axios.get(videoUrl, { responseType: 'stream' });
    const outputPath = path.resolve(process.cwd(), outputFileName);
    const writer = fs.createWriteStream(outputPath);
  
    response.data.pipe(writer);
  
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`💾 Video guardado en: ${outputPath}`);
        resolve("Video guardado exitosamente.");
      });
      writer.on('error', reject);
    });
  }

  (async () => {
    try {
      const imagePath = path.join(process.cwd(), 'upload-images', 'auri.jpg');
      const prompt = `La imagen muestra una funda de auriculares inalámbricos JBL.  La funda es de color negro mate y tiene forma ovalada.  Los auriculares, también negros, se alojan en dos huecos en la parte superior de la funda. El logotipo de JBL está grabado en la parte inferior de la funda.  La imagen es de alta resolución y el objeto está bien iluminado, mostrando detalles como la textura de la funda y el logotipo.

        Prompt para la animación:

    "Crea una animación de 8 segundos de una funda de auriculares JBL negra, similar a la imagen adjunta.  La animación mostrará una suave rotación de la funda sobre su eje vertical, a una velocidad constante.  El fondo debe ser negro sólido.  Mantén la alta calidad de la imagen original y los detalles deben ser nítidos. El movimiento debe ser fluido y realista."
    `;
      const videoId = await createVideoTask(imagePath, prompt);
      const videoUrl = await waitForVideoReady(videoId);
      await downloadVideo(videoUrl, 'auri-video.mp4');
    } catch (error:any) {
      console.error('❌ Error en el proceso de generación de video:', error.message);
    }
  })();
