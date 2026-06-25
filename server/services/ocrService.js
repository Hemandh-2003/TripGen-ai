import Tesseract from "tesseract.js";

export const extractTextFromImage =
    async (imageBuffer) => {

        const {
            data: { text },
        } =
            await Tesseract.recognize(
                imageBuffer,
                "eng"
            );

        return text;
    };