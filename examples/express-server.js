/**
 * Express.js server example for Isahaq Barcode Generator
 */

const express = require('express');
const BarcodeGenerator = require('@isahaq/barcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Barcode generation endpoint
app.get('/barcode/:data', async (req, res) => {
  const { data } = req.params;
  const { type = 'code128', format = 'png', width, height } = req.query;

  try {
    const options = {};
    if (width) options.width = parseInt(width);
    if (height) options.height = parseInt(height);

    let result;
    let contentType;

    switch (format) {
      case 'png':
        result = BarcodeGenerator.png(data, type, options);
        contentType = 'image/png';
        break;
      case 'svg':
        result = BarcodeGenerator.svg(data, type, options);
        contentType = 'image/svg+xml';
        break;
      case 'html':
        result = BarcodeGenerator.html(data, type, options);
        contentType = 'text/html';
        break;
      case 'pdf':
        result = await BarcodeGenerator.pdf(data, type, options);
        contentType = 'application/pdf';
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    res.set('Content-Type', contentType);
    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// QR code generation endpoint
app.get('/qr/:data', async (req, res) => {
  const { data } = req.params;
  const {
    size = 300,
    logo,
    label,
    watermark,
    watermarkPosition = 'center',
    errorCorrection = 'M',
  } = req.query;

  try {
    const qrOptions = {
      data: decodeURIComponent(data),
      size: parseInt(size),
      errorCorrectionLevel: errorCorrection,
    };

    if (logo) qrOptions.logoPath = logo;
    if (label) qrOptions.label = label;
    if (watermark) {
      qrOptions.watermark = watermark;
      qrOptions.watermarkPosition = watermarkPosition;
    }

    const qrCode = BarcodeGenerator.modernQr(qrOptions);
    const result = await qrCode.generate();

    res.set('Content-Type', 'image/png');
    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Batch generation endpoint
app.post('/batch', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }

    const results = BarcodeGenerator.batch(items);
    res.json({ results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Validation endpoint
app.get('/validate/:data/:type', (req, res) => {
  const { data, type } = req.params;

  try {
    const validation = BarcodeGenerator.validate(data, type);
    res.json(validation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get supported types
app.get('/types', (req, res) => {
  const types = BarcodeGenerator.getBarcodeTypes();
  res.json({ types });
});

// Get supported formats
app.get('/formats', (req, res) => {
  const formats = BarcodeGenerator.getRenderFormats();
  res.json({ formats });
});

// Get watermark positions
app.get('/watermark-positions', (req, res) => {
  const positions = BarcodeGenerator.getWatermarkPositions();
  res.json({ positions });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🔗 Barcode endpoint: http://localhost:${PORT}/barcode/{data}?type=code128&format=png`
  );
  console.log(
    `🔗 QR code endpoint: http://localhost:${PORT}/qr/{data}?size=300`
  );
  console.log(`🔗 Types endpoint: http://localhost:${PORT}/types`);
  console.log(`🔗 Formats endpoint: http://localhost:${PORT}/formats`);
});

module.exports = app;
