import express from "express";
import axios from "axios";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
// import { get_status_media } from "./pixelcut-api.js";
// import FormData from "form-data"; // Asegúrate de instalar form-data si no lo tienes ya
// import fetch from "node-fetch"; // Si usas node-fetch en Node.js

import { config } from "dotenv";
import { url } from "inspector";

config();
const PIXELCUT_API_KEY = process.env.PIXELCUT_API_KEY; // Asegúrate de que la variable de entorno esté configurada correctamente
const VIMMERSE_API_KEY = process.env.VIMMERSE_API_KEY; // Asegúrate de que la variable de entorno esté configurada correctamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Guardar archivos de imagen entrantes

const uploadDir = path.join(process.cwd(), "upload-images");
const contentDir = path.join(process.cwd(), "content-generated");
const tempDir = path.join(__dirname, "../temp");

fs.ensureDirSync("upload-images"); // crea la carpeta si no existe
fs.ensureDirSync("content-generated"); // crea la carpeta si no existe
fs.ensureDirSync("temp"); // crea la carpeta si no existe

// 2️⃣ Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // destino donde se guarda la imagen
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // nombre del archivo guardado
  },
});

// 3️⃣ Instanciamos Multer con la config de almacenamiento
const upload = multer({ storage });

// Habilitar CORS correctamente para solicitudes preflight
const corsOptions = {
  origin: [
    "https://image-generation-zl38.onrender.com",
    "http://localhost:5174",
  ], // Cambia esto según sea necesario
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Permitir credenciales si es necesario
};

const app = express();
const port = process.env.port || 3500;
// Load environment variables from .env file
app.use(cors(corsOptions)); // Habilitar CORS para todas las rutas y métodos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Si tu servidor maneja una solicitud OPTIONS (preflight), responde correctamente
// app.options('*', cors(corsOptions));  // Permitir el preflight para todos los métodos

// Servir archivos estáticos (por ejemplo, imágenes)
app.use("/images", express.static(uploadDir));
app.use("/content-generated", express.static(contentDir));

app.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No se envió ninguna imagen." });
    return;
  }

  console.log("Imagen recibida:", req.file.filename);

  res.json({
    id: req.file.filename,

    message: "Imagen subida exitosamente.",
    fileName: req.file.filename,
    url: `/images/${req.file.filename}`,
  });
});

app.post("/remove-background", async (req, res) => {
  const { fileName, background, animation } = req.body;

  if (!fileName) {
    res.status(400).json({ error: "El nombre del archivo es requerido" });
    return;
  }

  const jobId = uuidv4();

  // Devolver inmediatamente al frontend
  res.json({ jobId, status: "processing" });

  // Procesar en segundo plano
  (async () => {
    try {
      const imageUrl = `https://imagemotionapp-production.up.railway.app/images/${fileName}`;

      // Paso 1: Remover fondo
      const response = await axios.post(
        "https://api.developer.pixelcut.ai/v1/remove-background",
        {
          image_url: imageUrl,
          format: "png",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-KEY": PIXELCUT_API_KEY,
          },
        }
      );

      let result_url = response.data.result_url;

      // Paso 2: Generar fondo (si corresponde)
      if (background) {
        const responseBg = await axios.post(
          "https://api.developer.pixelcut.ai/v1/generate-background",
          {
            image_url: result_url,
            image_transform: { scale: 0.8, x_center: 0.3, y_center: 0.5 },
            scene: null,
            prompt:
              "Create a neutral, minimalist background that contrasts appropriately with the product color, using soft grays and whites to highlight the product without distracting attention.",
            negative_prompt: "",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-KEY": PIXELCUT_API_KEY,
            },
          }
        );

        result_url = responseBg.data.result_url;
      }
      console.log("URL de la imagen procesada:", result_url);

      // Si no se quiere animación, guardar como imagen final
      if (!animation) {
        const filePath = path.join("content-generated", `${jobId}.json`);
        await fs.outputJson(filePath, { result_url, type: "image" });
        return;
      }

      // Paso 3: Crear animación
      const image_id_motion = await create_motion_fetch(result_url);

      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      let processing = true;

      while (processing) {
        await delay(30000);
        console.log(
          "Esperando 30 segundos para verificar el estado de la animación..."
        );

        const status = await get_status_media({ id: image_id_motion.data.id });
        if (status.data.processing_status === "success") {
          console.log("✅ Proceso de animación completado.");

          processing = false;
        }
      }

      const url_video_motion = await create_motion({
        id: image_id_motion.data.id,
      });

      if (url_video_motion) {
        await fs.outputJson(path.join("content-generated", `${jobId}.json`), {
          result_url: url_video_motion,
          type: "video",
        });
      }
    } catch (error) {
      console.error("❌ Error en proceso async:", error);
      await fs.outputJson(path.join("content-generated", `${jobId}.json`), {
        error: true,
        message: "Fallo al procesar la imagen.",
      });
    }
  })();
});

app.get("/job/:id", async (req, res) => {
  const filePath = path.join("content-generated", `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) {
    res.json({ status: "processing" });
    return;
  }

  const data = await fs.readJson(filePath);

  if (data.error) {
    res.status(500).json({ status: "error", message: data.message });
    return;
  }

  res.json({ status: "done", ...data });
});

export const create_motion = async ({ id }: { id: string }) => {
  const resp = await fetch(`https://api.vimmerse.net/media/${id}`, {
    method: "GET",
    headers: new Headers({
      "X-Api-Key": VIMMERSE_API_KEY || "",
    }),
  });

  const data = await resp.text();
  const dataJson = JSON.parse(data);
  if (dataJson.data.result && dataJson.data.result.length > 0) {
    const url_video = dataJson.data.result[0]?.url;
    return url_video;
  }
  return null; // Si no hay resultado, devuelve null
};

// La función asincrónica para crear la solicitud
export const create_motion_fetch = async (imageUrl: string) => {
  const form = new FormData(); // Crear un FormData para enviar los datos

  try {
    // Descargar la imagen desde la URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Error al descargar la imagen");
    }
    const imageBlob = await response.blob(); // Convertir la imagen a un Blob

    // Agregar la imagen al FormData
    form.append("image_files", imageBlob, "image.jpg"); // Aquí agregas el archivo de imagen como un Blob

    // Agregar otros datos al FormData
    form.append(
      "prompt",

      `
      Apply a subtle zoom effect to [product] for 5 seconds, keeping it centered and unchanged. Conclude with a smooth fade-in for a seamless transition to the presentation.
      Apply a 3D-style rotation of the product.

      Additional Tips:

      Maintain product integrity: Ensure the animation doesn't alter the product's appearance, shape, or color.

        Smooth transitions: Use smooth zoom-in and fade-out effects to create a professional and discreet animation.
        Avoid abrupt changes or distractions.
      `
    );
    form.append("motion_type", "Auto");

    // Configurar los encabezados de la solicitud
    const headers = new Headers({
      "X-Api-Key": VIMMERSE_API_KEY || "", // Tu clave de API para la autenticación
    });

    // Realizar la solicitud POST a la API de Vimmerse
    const apiResponse = await fetch("https://api.vimmerse.net/media", {
      method: "POST",
      headers: headers,
      body: form, // Usamos form directamente aquí
    });

    // Manejar la respuesta de la API
    const data = await apiResponse.json();
    console.log("Respuesta de la API de vimmerse:");

    return data;
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
  }
};

const get_status_media = async ({ id }: { id: string }) => {
  try {
    const resp = await fetch(
      `https://api.vimmerse.net/media/${id}/processing-status`,
      { method: "GET" }
    );

    const data = await resp.text();
    const dataJson = JSON.parse(data);
    console.log(data);
    return dataJson;
  } catch (error) {
    console.error("Error al obtener el estado del medio:", error);
    throw error; // Lanza el error para que pueda ser manejado por el llamador
  }
};

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Directorio de subida: ${uploadDir}`);
  console.log(`Ruta de subida: /upload-images`);
});

/* Respuesat de la API de Vimmerse en el primer endpoint , capturar el id
    Respuesta de la API: {
  data: {
    id: 'f2ab750f-5c1e-418f-b399-16a695cfb638',
    title: 'Nuevo ejemplo de media',
    description: '',
    rating: '',
    customer_id: 'winwin',
    batch_id: '',
    base_url: 'https://media.vimmerse.net/winwin/f2ab750f-5c1e-418f-b399-16a695cfb638',
    is_transition: null,
    duration_time: '0',
    progress_percentage: 20,
    processing_status: 'queue_bullet',
    visibility_status: '1',
    file_map: null,
    intermediate_results: [],
    submit_params: {
      sound_effects: 'no',
      pipeline_preset: 'Fast',
      file_size: '',
      scale_factor: '1'
    },
    pose_preset: {
      MotionType: 'Auto',
      Params: 'Prompt="A [product] on a neutral background. The camera smoothly zooms in as the product rotates a full 360 degrees, highlighting its key features and reflections, with soft lighting highlighting its design.|CameraPath=|Quantity=1|MotionAmount=5|MotionLength=5|Loop=1|OriginalPrompt="Un [producto] sobre un fondo neutral. La cámara aplica un suave zoom-in mientras el producto realiza una rotación completa de 360 grados, destacando sus características principales y reflejos, con iluminación suave que resalta su diseño.'
    },
    bullet_version: '0',
    video_history: [],
    result: [],
    webhook_url: '',
    nsfw: '0',
    service_name: null,
    service_version: null,
    created_at: '2025-04-02 01:33:32.857617+00:00',
    updated_at: '2025-04-02 01:33:33.083933+00:00',
    version: '2'
  }
}
*/
