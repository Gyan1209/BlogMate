import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
import conf from '../conf/conf';
import service from '../appwrite/config';

const {tinyMceKey} = conf;

export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full font-semibold'> 
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
        <Editor
        apiKey={tinyMceKey}
        initialValue={defaultValue}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            images_upload_handler: service.tinyMCEuploadImageHandler,
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}


// import React from 'react';
// import { Editor } from '@tinymce/tinymce-react';
// import { Controller } from 'react-hook-form';
// import conf from '../conf/conf';

// const { tinyMceKey, backendUrl } = conf;

// export default function RTE({ name, control, label, defaultValue = "" }) {
//   return (
//     <div className='w-full font-semibold'>
//       {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

//       <Controller
//         name={name || "content"}
//         control={control}
//         render={({ field: { onChange } }) => (
//           <Editor
//             apiKey={tinyMceKey}
//             initialValue={defaultValue}
//             onEditorChange={onChange}
//             init={{
//               height: 500,
//               menubar: true,
//               plugins: [
//                 "image", "code", "advlist", "autolink", "lists", "link",
//                 "charmap", "preview", "anchor", "searchreplace", "visualblocks",
//                 "fullscreen", "insertdatetime", "media", "table", "help", "wordcount"
//               ],
//               toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code help",
//               content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//               file_picker_types: 'image',
//               file_picker_callback: (callback, value, meta) => {
//                 const input = document.createElement('input');
//                 input.setAttribute('type', 'file');
//                 input.setAttribute('accept', 'image/*');

//                 input.onchange = async function () {
//                   const file = this.files[0];
//                   const formData = new FormData();
//                   formData.append("image", file);

//                   try {
//                     const res = await fetch(`${backendUrl}/api/post/image-upload`, {
//                       method: "POST",
//                       headers: {
//                         token: `${localStorage.getItem("token")}`,
//                       },
//                       body: formData,
//                     });

//                     const data = await res.json();
//                     const imageUrl = data.imageUrl;

//                     // Auto-fill image meta (alt, width, height)
//                     const img = new Image();
//                     img.onload = () => {
//                       callback(imageUrl, {
//                         alt: file.name,
//                         width: img.width,
//                         height: img.height,
//                       });
//                     };
//                     img.src = imageUrl;
//                   } catch (err) {
//                     console.error("Image upload failed:", err);
//                     alert("Image upload failed.");
//                   }
//                 };

//                 input.click();
//               }
//             }}
//           />
//         )}
//       />
//     </div>
//   );
// }
