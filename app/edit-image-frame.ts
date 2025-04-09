import {formdata} from './form-data-edit-frame'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path';

import dotenv from 'dotenv'
dotenv.config()

const outputPath = path.join(process.cwd(), "resized-images", "output.png");

const PHOTOROOM_API_KEY = process.env.PHOTOROOM_SANDBOX_API_KEY || '';

// Utilizamos la api de photorrom (https://www.photoroom.com/api/docs/reference/bdfb80d8bcd00-image-editing-v2-plus-plan)
// Deberia recibir: {imagePath , margin (top-bottom-left-right) , outputSize (widthxheight) , shadow.mode (ai.soft, ai.hard, ai.floating)}
const edit_image_frame = async () => {
    try {
        
        const response = await fetch('https://image-api.photoroom.com/v2/edit',{
            method: 'POST',
            headers: { 
                'Accept': 'image/png, application/json',
                'x-api-key': PHOTOROOM_API_KEY},
            body: formdata
        })
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(outputPath, buffer);

    } catch (error) {
        console.error('Error:', error);
    }
}

edit_image_frame()


