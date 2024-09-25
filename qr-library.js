// qr-library.js

class SimpleQRCode {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.size = options.size || 200;
        this.colorDark = options.colorDark || "#000000";
        this.colorLight = options.colorLight || "#ffffff";
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

        // For simplicity, we're using a basic binary representation of characters.
        const binaryData = this._toBinary(data);

        // Draw the QR code based on the binary data.
        this._drawQRCode(binaryData);
    }

    _toBinary(text) {
        // Convert each character in the text to binary, return an array of "1"s and "0"s
        return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    }

    _drawQRCode(binaryData) {
        const pixelSize = this.size / binaryData.length;
        for (let i = 0; i < binaryData.length; i++) {
            for (let j = 0; j < binaryData.length; j++) {
                const color = binaryData[j] === '1' ? this.colorDark : this.colorLight;
                this.context.fillStyle = color;
                this.context.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.size, this.size);
    }
}
