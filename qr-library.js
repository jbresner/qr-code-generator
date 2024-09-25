class SimpleQRCode {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.size = options.size || 200;
        this.colorDark = options.colorDark || "#000000";
        this.colorLight = options.colorLight || "#ffffff";
        this.errorCorrectionLevel = options.errorCorrectionLevel || "L"; // L = 7%, M = 15%, Q = 25%, H = 30%
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.element.appendChild(this.canvas);
    }

    generate(data) {
        if (!data) {
            throw new Error("Data is required to generate a QR code");
        }

        // Step 1: Convert the data to binary
        let binaryData = this._toBinary(data);

        // Step 2: Apply error correction to the binary data
        binaryData = this._applyErrorCorrection(binaryData);

        // Step 3: Draw the QR code based on the binary data
        this._drawQRCode(binaryData);
    }

    _toBinary(text) {
        // Convert each character in the text to binary
        return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    }

    _applyErrorCorrection(binaryData) {
        const errorCorrectionLevels = {
            L: 0.07, // 7% of data can be recovered
            M: 0.15, // 15%
            Q: 0.25, // 25%
            H: 0.30  // 30%
        };

        const correctionPercentage = errorCorrectionLevels[this.errorCorrectionLevel];
        const correctionDataLength = Math.ceil(binaryData.length * correctionPercentage);

        // Simulate error correction by adding redundant binary data (for simplicity)
        const redundantData = this._generateRedundantData(correctionDataLength);

        // Combine the original binary data with the redundant data
        return binaryData + redundantData;
    }

    _generateRedundantData(length) {
        // Create a string of redundant data (1s and 0s)
        return '1'.repeat(length).split('').map((bit, index) => (index % 2 === 0 ? '1' : '0')).join('');
    }

    _drawQRCode(binaryData) {
        const dataLength = Math.sqrt(binaryData.length); // Assuming square QR code matrix
        const pixelSize = this.size / dataLength;
        for (let i = 0; i < dataLength; i++) {
            for (let j = 0; j < dataLength; j++) {
                const color = binaryData[i * dataLength + j] === '1' ? this.colorDark : this.colorLight;
                this.context.fillStyle = color;
                this.context.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.size, this.size);
    }
}

