// import { Editframe } from "@editframe/editframe-js";
// import dotenv from "dotenv";
// import fs from 'fs'
// import FormData from 'form-data'
// import fetch, { Headers } from 'node-fetch'
// import path , {dirname}from 'path';
// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const videoPath = path.resolve(__dirname, 'videos/shirt-animation.mp4');
// dotenv.config();



// const EDITFRAME_TOKEN_ID=process.env.EDITFRAME_TOKEN_ID || '';
// // var myHeaders = new Headers()
// // myHeaders.append('Authorization', `Bearer ${EDITFRAME_TOKEN_ID}`)

// var formdata = new FormData()
// const headers = formdata.getHeaders();
// headers['Authorization'] = `Bearer ${EDITFRAME_TOKEN_ID}`;
// formdata.append('video', fs.createReadStream(videoPath))
// formdata.append('height', '400')
// formdata.append('width', '1920')

// var requestOptions = {
//   method: 'POST',
//   headers: headers,
//   body: formdata,
// //   redirect: 'follow',
// }

// const editFrame =async () => {
//     try {
//         const response = await fetch('https://api.editframe.com/v2/videos/resize', requestOptions)
//         const data = await response.json()
//         console.log(data);
        
//     } catch (error) {
//         console.error('Error:', error);
//     }

// }
 



//   editFrame()

// const editframe = new Editframe({ token: EDITFRAME_TOKEN_ID });

// const getVideos = async () => {
//     const response = await editframe.videos.all()
//     console.log(response);
    

// }

// const getVideoById = async ({id}:{id:string}) => {
//     const response = await editframe.videos.get({id})
//     console.log(response);
    

// }

// // getVideos()

// // getVideoById({id:'L6qlDN9Gqm'})