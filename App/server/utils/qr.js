const QRCode = require('qrcode');

// Renders the plain numeric code as an inline SVG string (self-hosted, no
// third-party QR service). The QR payload is just the code itself — the
// in-app scanner decodes it and submits it exactly like manual keypad entry.
async function codeToQrSvg(code) {
  return QRCode.toString(code, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 220,
  });
}

module.exports = { codeToQrSvg };
