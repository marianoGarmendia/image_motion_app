// Remove bg
import { create_motion, create_motion_fetch } from ".";
import FormData from "form-data"; // Asegúrate de instalar form-data si no lo tienes ya
import fetch from "node-fetch";

// import axios from 'axios';
// let data = JSON.stringify({
//   "image_url": "https://cdn3.pixelcut.app/product.jpg",
//   "format": "png"
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://api.developer.pixelcut.ai/v1/remove-background',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Accept': 'application/json', 
//     'X-API-KEY': '<API_KEY_VALUE>', 
    
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });
export const get_status_media = async ({id}) => {
    try {
        const resp = await fetch(
            `https://api.vimmerse.net/media/${id}/processing-status`,
            {method: 'GET'}
          );
          
          const data = await resp.text();
        const dataJson = JSON.parse(data);
          console.log(data);
          return dataJson;
        
    } catch (error) {
        console.error("Error al obtener el estado del medio:", error);
        throw error; // Lanza el error para que pueda ser manejado por el llamador
    }

}


// (async () => {
//     const form = new FormData(); // Crear un FormData para enviar los datos

//     const response = await fetch("https://cdn2.pixelcut.app/public/result/39b52e25-a995-465f-bb4b-36b4e66b682a.png")
//         if (!response.ok) {
//           throw new Error("Error al descargar la imagen");
//         }
//         const imageBlob = await response.blob(); // Convertir la imagen a un Blob
//         console.log(imageBlob);

//         form.append("image_files", imageBlob, "image.jpg"); // Aquí agregas el archivo de imagen como un Blob
        
//             // Agregar otros datos al FormData
//             form.append(
//               "prompt",
//               "Un [producto] sobre un fondo neutral. La cámara aplica un suave zoom-in mientras el producto realiza una rotación completa de 360 grados, destacando sus características principales y reflejos, con iluminación suave que resalta su diseño."
//             );
//             form.append("motion_type", "KlingAi");
        
//             // Configurar los encabezados de la solicitud
//             const headers = {
//               "X-Api-Key": "pr3yvaOm1Yb8vO_2cc1roli-pH0IquCgHIr5yb4bOZA", // Tu clave de API para la autenticación
//             };
        
//             // Realizar la solicitud POST a la API de Vimmerse
//             const apiResponse = await fetch("https://api.vimmerse.net/media", {
//               method: "POST",
//               headers: headers,
//               body: form, // Usamos form directamente aquí
//             });
        
//             // Manejar la respuesta de la API
//             const data = await apiResponse.json();
//             console.log("Respuesta de la API:", data);
            
        

//     // await create_motion({id:"b43f9905-f9d8-471e-95cd-1fb176fc9534"})
//     // await create_motion_fetch("https://cdn2.pixelcut.app/public/result/39b52e25-a995-465f-bb4b-36b4e66b682a.png")
    
//     // await get_status_media({id:"b43f9905-f9d8-471e-95cd-1fb176fc9534"}) // devuelve: {"data":{"progress_percentage":60,"processing_status":"processing_bullet"}} hacerlo cada 1 min
// })()

/*
Requerimientos de la request


unput image: --> 1 image per request
Max size: 25MB
Min resolution: 64x64px
Max resolution: 6000x6000px




*/ 
