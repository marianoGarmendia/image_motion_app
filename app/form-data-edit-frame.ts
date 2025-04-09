import FormData from 'form-data'
import fs from 'fs'
import path , {dirname}from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagePath = path.resolve(__dirname, 'images-resize/image_two.png');

const formdata = new FormData()

// // 📷 Imagen principal (obligatorio en POST)
formdata.append('imageFile', fs.createReadStream(imagePath)) // imagen principal que será procesada

// // 🖼️ Fondo
// formdata.append('background.color', 'FF0000') // color de fondo (hex o nombre de color)
// formdata.append('background.expandPrompt', 'ai.auto') // modo de expansión automática del prompt (si aplica)
// formdata.append('background.guidance.imageFile', fs.createReadStream('./path/to/guidance.jpg')) // imagen de guía para el fondo
// formdata.append('background.guidance.scale', '0.7') // qué tan parecido debe ser el fondo a la imagen guía
// formdata.append('background.imageFile', fs.createReadStream('./path/to/background.jpg')) // imagen que se usará directamente como fondo
// formdata.append('background.negativePrompt', 'no clutter') // texto para indicar qué excluir (legacy)
// formdata.append('background.prompt', 'sunset over mountains') // prompt para generar el fondo
// formdata.append('background.scaling', 'fit') // 'fit' o 'fill' para ajustar el fondo
// formdata.append('background.seed', '12345') // semilla para reproducibilidad

// // ➕ Expansión
// formdata.append('expand.mode', 'auto') // modo de expansión (si aplica)
// formdata.append('expand.seed', '54321') // semilla para expansión

// // 🖼️ Exportación
// formdata.append('export.dpi', '300') // densidad de píxeles del resultado
// formdata.append('export.format', 'png') // formato de exportación

// // 🎯 Alineación
// formdata.append('horizontalAlignment', 'center') // alineación horizontal del sujeto
// formdata.append('verticalAlignment', 'bottom') // alineación vertical del sujeto

// // 🚫 Padding y márgenes
// formdata.append('ignorePaddingAndSnapOnCroppedSides', 'true') // ajustar padding en zonas recortadas
formdata.append('margin', '10%') // margen general
// formdata.append('marginTop', '20%')
// formdata.append('marginBottom', '10%')
// formdata.append('marginLeft', '5%')
// formdata.append('marginRight', '5%')
// formdata.append('padding', '5%') // padding general
// formdata.append('paddingTop', '5%')
// formdata.append('paddingBottom', '5%')
// formdata.append('paddingLeft', '5%')
// formdata.append('paddingRight', '5%')

// // 📐 Tamaño de salida
formdata.append('outputSize', '1920x400') // opciones: auto, originalImage, croppedSubject, widthxheight
// // formdata.append('maxHeight', '1080') // altura máxima si se usa redimensionado
// // formdata.append('maxWidth', '1920') // anchura máxima si se usa redimensionado

// // 📦 Referencia para márgenes/padding
// formdata.append('referenceBox', 'subjectBox') // subjectBox o originalImage

// // 🧼 Limpieza y mejoras
// formdata.append('removeBackground', 'true') // eliminar fondo original
// formdata.append('keepExistingAlphaChannel', 'auto') // respetar canal alfa existente
// formdata.append('lighting.mode', 'ai.auto') // modo de iluminación
// formdata.append('scaling', 'fit') // ajustar sujeto dentro de la imagen

// // 🧠 Segmentación
// formdata.append('segmentation.mode', 'keep') // mantener el objeto importante
// formdata.append('segmentation.prompt', 'keep the person')
// formdata.append('segmentation.negativePrompt', 'remove background noise')

// // 🪞 Sombra
// formdata.append('shadow.mode', 'ai.soft') // opciones: ai.soft, ai.hard, ai.floating

// // 🧠 Plantilla y texto
// formdata.append('templateId', 'template-uuid-aqui') // UUID de una plantilla (si aplica)
// formdata.append('textRemoval.mode', 'auto') // modo para quitar texto

// // 🧽 Upscaling
// formdata.append('upscale.mode', 'standard') // modo de upscaling (puede cambiar o deprecado)

export {
    formdata
}
