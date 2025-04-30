export default async function decodeJWT(token) {
    try {
        const payload = token.split('.')[1]; // get middle part
        const decoded = atob(payload); // base64 decode
        const userData=await JSON.parse(decoded); // parse JSON string to object
        return userData;
    } catch (e) {
        console.error("Failed to decode token", e);
        return null;
    }
}