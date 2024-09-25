function generateQRCode() {
    var qrText = document.getElementById("text-input").value;
    var errorLevel = document.getElementById("error-level").value;

    if (qrText === "") {
        alert("Please enter text or a URL!");
        return;
    }

    // Clear any previous QR codes
    document.getElementById("qr-code").innerHTML = "";

    // Generate a new QR code using the qr-code.js library
    var qrCode = new QRCode(document.getElementById("qr-code"), {
        text: qrText,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel[errorLevel]
    });
}
