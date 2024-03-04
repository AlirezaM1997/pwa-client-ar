// Function to convert File to base64 stirng
export function imageToBase64Promise(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", (ev) => {
            resolve(ev.target.result);
        });
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
    });
}

// Function to convert Base64 string to File
export function base64ToFile(base64, filename) {
    var arr = base64.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}