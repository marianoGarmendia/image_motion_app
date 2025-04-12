// import {formdata} from './form-data-edit-frame'
import FormData from "form-data";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();

interface IEditImageFrame {
  imagePath: string;
  outputPath: string;
  outputSize: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PHOTOROOM_API_KEY = process.env.PHOTOROOM_SANDBOX_API_KEY || "";

// Utilizamos la api de photorrom (https://www.photoroom.com/api/docs/reference/bdfb80d8bcd00-image-editing-v2-plus-plan)
// Deberia recibir: {imagePath , margin (top-bottom-left-right) , outputSize (widthxheight) , shadow.mode (ai.soft, ai.hard, ai.floating)}
export const edit_image_frame = async ({
  imagePath,
  outputPath,
  outputSize,
}: IEditImageFrame) => {
  const image = path.resolve(__dirname, `images-to-resize/${imagePath}`);
  const output = path.join(process.cwd(), "resized-images", outputPath);

  const isValidOutputSize = /^(\d{2,5})x(\d{2,5})$/.test(outputSize);
  if (!isValidOutputSize) {
    throw new Error(
      `❌ Formato de outputSize inválido: "${outputSize}". Debe ser algo como "1920x400"`
    );
  }


  const formdata = new FormData();
  formdata.append("imageFile", fs.createReadStream(image));
  formdata.append("margin", "10%");
  formdata.append("outputSize", outputSize); // usás el parámetro correctamente ahora

  try {
    const response = await fetch("https://image-api.photoroom.com/v2/edit", {
      method: "POST",
      headers: {
        Accept: "image/png, application/json",
        "x-api-key": PHOTOROOM_API_KEY,
      },
      body: formdata,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error de API: ${response.status} - ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(output, buffer);
  } catch (error) {
    console.error("Error:", error);
  }
};

// edit_image_frame({imagePath: 'image_two.png', outputPath: 'output_img_two.png', outputSize: '1920x400'})
