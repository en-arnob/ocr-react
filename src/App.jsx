import { useState } from "react";
import Tesseract from "tesseract.js";

function MultiLangOCR() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (event) => {
        setLoading(true);
        const image = event.target.files[0];

        if (image) {
            Tesseract.recognize(
                image,
                "ben+eng", // Use Bengali & English
                {
                    logger: (m) => console.log(m), // Show OCR progress
                }
            )
            .then(({ data: { text } }) => {
                setText(text);
                setLoading(false);
            })
            .catch((err) => {
                console.error("OCR Error:", err);
                setLoading(false);
            });
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            {loading ? <p>Processing...</p> : <p>Extracted Text: {text}</p>}
        </div>
    );
}

export default MultiLangOCR;