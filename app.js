function convertWebPToPNGandJPG(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith("image/webp")) {
            return reject("Invalid file type. Please provide a .webp image.");
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                
                // Resize image (set max width to 300px)
                const maxWidth = 300;
                const scaleFactor = maxWidth / img.width;
                const newWidth = maxWidth;
                const newHeight = img.height * scaleFactor;

                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                const pngData = canvas.toDataURL("image/png");
                const jpgData = canvas.toDataURL("image/jpeg", 0.9);
                
                resolve({ png: pngData, jpg: jpgData });
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

document.getElementById("file-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const loadingDiv = document.getElementById("loading");
    const outputDiv = document.getElementById("output");

    // Show loading indicator
    loadingDiv.style.display = "block";
    outputDiv.innerHTML = "";  // Clear any previous output

    convertWebPToPNGandJPG(file).then(({ png, jpg }) => {
        // Hide loading indicator
        loadingDiv.style.display = "none";

        // Display the converted images and download links
        outputDiv.innerHTML = `  
            <p>Converted Images:</p>
            <a href="${png}" download="converted.png">
                <button>Download PNG</button>
            </a>
            <a href="${jpg}" download="converted.jpg">
                <button>Download JPG</button>
            </a>
            <div>
                <img src="${png}" alt="PNG preview">
                <img src="${jpg}" alt="JPG preview">
            </div>
        `;
    }).catch((error) => {
        loadingDiv.style.display = "none";
        console.error(error);
    });
});