import { compressImage, maxSizeImgInBytes } from "@functions/compressImage";
import { useState } from "react";
import toast from "react-hot-toast";
import Toast from "@components/kit/toast/Main";
import { imageToBase64Promise } from "@functions/imageToBase64Promise";

const maxFileCount = 7

const useMultiImageToBase64 = () => {
    const [base64Images, setBase64Images] = useState(null);
    const [overMaxSize, setOverMaxSize] = useState(null);

    const handleImageChange = (event, t) => {
        const filesList = event.target.files;
        if (filesList) {
            if (filesList.length > maxFileCount) {
                toast.custom(() => <Toast text={t("addPicture.imposibleAddPicture")} status="WARNING" />)
            } else {
                /* Get files in array form */
                const files = Array.from(filesList);
                const base64List = []
                const addToBase64List = async (compressedFile) => {
                    const base64 = await imageToBase64Promise(compressedFile)
                    base64List.push(base64)
                    if (base64List.length === files.length) setBase64Images(base64List)
                }
                /* Map each file to a promise that resolves to an array of image URI's */
                files.map((file) => {
                    if (file.size > (25 * maxSizeImgInBytes)) {
                        setOverMaxSize(true);
                        setBase64Images(null)
                    } else {
                        compressImage(file, addToBase64List)
                    }
                });
                if (files.length === base64List.length) {
                    setBase64Images(base64List)
                }
            }
        }
    };

    return {
        base64Images,
        handleImageChange,
        overMaxSize,
        setOverMaxSize,
    };
}

export default useMultiImageToBase64;
