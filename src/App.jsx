import { useState } from "react";
import Tesseract from "tesseract.js";

function MultiLangOCR() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [confidence, setConfidence] = useState(null);
    const [selectedLang, setSelectedLang] = useState("ben+eng");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setProgress(0);
        setText("");
        setConfidence(null);

        try {
            const result = await Tesseract.recognize(
                selectedFile,
                selectedLang,
                {
                    logger: m => {
                        if (m.status === "recognizing text") {
                            setProgress(parseInt(m.progress * 100));
                        }
                    },
                    tessedit_pageseg_mode: "1",
                    preserve_interword_spaces: "1",
                    tessedit_char_blacklist: "©®™",
                    tessedit_enable_doc_dict: "1",
                    tessjs_create_hocr: "1",
                }
            );

            setText(result.data.text);
            setConfidence(result.data.confidence);
            setLoading(false);
        } catch (err) {
            console.error("OCR Error:", err);
            setText("Error processing image. Please try again.");
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setText("");
        setConfidence(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="ocr-container">
            <div className="language-buttons">
                <button 
                    onClick={() => setSelectedLang("eng")}
                    className={selectedLang === "eng" ? "active" : ""}
                >
                    English
                </button>
                <button 
                    onClick={() => setSelectedLang("ben")}
                    className={selectedLang === "ben" ? "active" : ""}
                >
                    Bangla
                </button>
                <button 
                    onClick={() => setSelectedLang("ben+eng")}
                    className={selectedLang === "ben+eng" ? "active" : ""}
                >
                    Bilingual
                </button>
            </div>

            <div className="file-controls">
                <label className="file-input-label">
                    <input 
                        type="file" 
                        onChange={handleImageSelect}
                        accept="image/*"
                    />
                    Choose Image
                </label>
                {selectedFile && (
                    <span className="selected-file-name">
                        {selectedFile.name}
                    </span>
                )}
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Selected" />
                    </div>
                )}
                <div className="action-buttons">
                    <button 
                        onClick={handleClear}
                        className="clear-button"
                        disabled={!selectedFile}
                    >
                        Clear
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={!selectedFile || loading}
                    >
                        Submit
                    </button>
                </div>
            </div>
            {loading && (
                <div className="progress">
                    <p>Processing... {progress}%</p>
                    <progress value={progress} max="100" />
                </div>
            )}
            {!loading && text && (
                <div className="result">
                    <p>Confidence Score: {confidence?.toFixed(2)}%</p>
                    <p>Extracted Text:</p>
                    <div className="text-output">{text}</div>
                </div>
            )}
        </div>
    );
}

export default MultiLangOCR;