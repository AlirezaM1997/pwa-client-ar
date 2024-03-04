import imageCompression from 'browser-image-compression';

export const maxSizeImgInBytes = 1024 * 1024 //1MB

export const compressImage = (imageFile, handleCompressedBase64) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp"
    }

    imageCompression(imageFile, options).then((compressedFile) => {
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        handleCompressedBase64(compressedFile)
    }).catch((error) => {
        console.log("error im compress image: ", error.message);
    })
}