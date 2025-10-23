# Isahaq Barcode Generator

> A comprehensive Node.js barcode generation library supporting 32+ barcode types with Express.js integration and CLI tools

[![npm version](https://img.shields.io/npm/v/isahaq-barcode.svg)](https://www.npmjs.com/package/isahaq-barcode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Supported Barcode Types](#-supported-barcode-types)
- [Usage Examples](#-usage-examples)
- [Express.js Integration](#-expressjs-integration)
- [CLI Usage](#-cli-usage)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## ✨ Features

| Feature               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| **32+ Barcode Types** | Linear, 2D, postal, stacked, and auto-detection variants |
| **Multiple Formats**  | PNG, SVG, HTML, JPG, PDF output support                  |
| **Framework Ready**   | Express.js middleware and route helpers included         |
| **CLI Tool**          | Generate barcodes directly from terminal                 |
| **Advanced QR Codes** | Logos, watermarks, labels, and customization             |
| **Validation**        | Built-in data validation for all barcode types           |
| **Batch Processing**  | Generate multiple barcodes simultaneously                |
| **High Performance**  | Optimized for enterprise-scale generation                |

---

## 📦 Installation

```bash
npm install @isahaq/barcode
```

**Requirements:** Node.js 18.0 or higher

## 🌐 Browser Compatibility

> **Important:** This package is designed for **Node.js server-side environments** and is not compatible with browser environments.

### Why Not Browser Compatible?

- **Canvas Dependency**: Uses Node.js `canvas` library for image generation
- **File System Access**: Requires Node.js `fs` module for file operations
- **Server-Side Rendering**: Designed for server-side barcode generation

### Recommended Usage Patterns

**✅ Server-Side (Recommended):**

```javascript
// Node.js/Express.js server
const BarcodeGenerator = require('@isahaq/barcode');

// Generate barcode on server
app.get('/barcode/:data', (req, res) => {
  const barcode = BarcodeGenerator.png(req.params.data, 'code128');
  res.set('Content-Type', 'image/png');
  res.send(barcode);
});
```

**✅ Next.js API Routes:**

```javascript
// pages/api/barcode.js or app/api/barcode/route.js
import BarcodeGenerator from '@isahaq/barcode';

export default function handler(req, res) {
  const barcode = BarcodeGenerator.png(req.query.data, 'code128');
  res.setHeader('Content-Type', 'image/png');
  res.send(barcode);
}
```

**❌ Client-Side (Not Supported):**

```javascript
// This will NOT work in browsers
import BarcodeGenerator from '@isahaq/barcode'; // ❌
```

### Alternative for Client-Side

For browser-based barcode generation, consider:

- **jsbarcode** - Client-side barcode generation
- **qrcode** - Client-side QR code generation
- **Server-side API** - Use this package on your backend

**Global CLI Installation:**

```bash
npm install -g @isahaq/barcode
```

---

## 🚀 Quick Start

```javascript
const BarcodeGenerator = require('@isahaq/barcode');

// Generate PNG barcode
const pngBuffer = BarcodeGenerator.png('1234567890', 'code128');

// Generate SVG barcode
const svgString = BarcodeGenerator.svg('1234567890', 'ean13');

// Generate QR code with logo
const qrCode = BarcodeGenerator.modernQr({
  data: 'https://example.com',
  size: 300,
  logoPath: 'path/to/logo.png',
  label: 'Scan me!',
});

await qrCode.saveToFile('qr-code.png');
```

---

## 📊 Supported Barcode Types

### Linear Barcodes (1D)

| Type           | Variants                           | Use Case                      |
| -------------- | ---------------------------------- | ----------------------------- |
| **Code 128**   | A, B, C, Auto                      | General purpose, high density |
| **Code 39**    | Standard, Extended, Checksum, Auto | Alphanumeric, automotive      |
| **Code 93**    | -                                  | Compact alphanumeric          |
| **EAN Family** | EAN-13, EAN-8, EAN-2, EAN-5        | Retail products (Europe)      |
| **UPC Family** | UPC-A, UPC-E                       | Retail products (USA)         |
| **Code 25**    | Standard, Interleaved, Auto        | Industrial, logistics         |
| **ITF-14**     | -                                  | Shipping containers           |
| **MSI**        | Standard, Checksum, Auto           | Inventory management          |
| **Codabar**    | -                                  | Libraries, blood banks        |
| **Code 11**    | -                                  | Telecommunications            |

### 2D Barcodes

| Type            | Data Capacity     | Use Case                |
| --------------- | ----------------- | ----------------------- |
| **QR Code**     | Up to 4,296 chars | URLs, payments, general |
| **Data Matrix** | Up to 2,335 chars | Small item marking      |
| **Aztec**       | Up to 3,832 chars | Transport tickets       |
| **PDF417**      | Up to 1,850 chars | IDs, boarding passes    |
| **Micro QR**    | Up to 35 chars    | Compact applications    |
| **MaxiCode**    | Up to 93 chars    | Package tracking        |

### Postal Barcodes

**POSTNET** • **PLANET** • **RMS4CC** • **KIX** • **IMB**

### Specialized

**Code 32** (Italian Pharmacode) • **PharmaCode** • **PharmaCodeTwoTracks** • **Code 16K** • **Code 49**

---

## 💻 Usage Examples

### Basic Generation

```javascript
const BarcodeGenerator = require('@isahaq/barcode');

// PNG with custom options
const barcode = BarcodeGenerator.png('1234567890', 'code128', {
  width: 3,
  height: 150,
  displayValue: true,
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  margin: 10,
});

// Convert to Base64 for web display
const base64Image = barcode.toString('base64');
console.log(`<img src="data:image/png;base64,${base64Image}" alt="Barcode" />`);
```

### Advanced QR Code with Logo

```javascript
const qrCode = BarcodeGenerator.modernQr({
  data: 'https://example.com',
  size: 300,
  margin: 10,

  // Logo configuration
  logoPath: 'path/to/logo.png',
  logoSize: 60, // Percentage

  // Text elements
  label: 'Scan me!',
  watermark: 'Company Name',
  watermarkPosition: 'bottom-center',

  // Colors
  foregroundColor: [0, 0, 0],
  backgroundColor: [255, 255, 255],

  // Error correction (H recommended for logos)
  errorCorrectionLevel: 'H',
});

// Save to file
await qrCode.saveToFile('qr-code.png');

// Get as data URI
const dataUri = await qrCode.getDataUri();
```

### QR Code Builder Pattern

```javascript
const { QrCodeBuilder } = require('isahaq-barcode');

const qrCode = QrCodeBuilder.create()
  .data('https://example.com')
  .size(300)
  .margin(10)
  .foregroundColor([0, 0, 0])
  .backgroundColor([255, 255, 255])
  .logoPath('path/to/logo.png')
  .logoSize(60)
  .label('Scan me!')
  .watermark('Watermark Text', 'center')
  .format('png')
  .build();

await qrCode.saveToFile('qr-code.png');
```

### Batch Generation

```javascript
const items = [
  { data: '1234567890', type: 'code128', format: 'png' },
  { data: '9876543210', type: 'code39', format: 'svg' },
  { data: 'https://example.com', type: 'qrcode', format: 'png' },
];

const results = BarcodeGenerator.batch(items);

results.forEach((result, index) => {
  if (result.success) {
    console.log(`✓ Barcode ${index} generated`);
    // result.data contains the generated barcode
  } else {
    console.error(`✗ Barcode ${index} failed: ${result.error}`);
  }
});
```

### Data Validation

```javascript
const validation = BarcodeGenerator.validate('1234567890', 'code128');

if (validation.valid) {
  console.log('✓ Valid data');
  console.log(`  Length: ${validation.length}`);
  console.log(`  Charset: ${validation.charset}`);
} else {
  console.error(`✗ Invalid: ${validation.error}`);
}
```

---

## 🌐 Express.js Integration

### Basic Route Implementation

```javascript
const express = require('express');
const BarcodeGenerator = require('@isahaq/barcode');

const app = express();

// Barcode endpoint
app.get('/barcode/:data', (req, res) => {
  const { data } = req.params;
  const { type = 'code128', format = 'png' } = req.query;

  try {
    let result, contentType;

    switch (format) {
      case 'png':
        result = BarcodeGenerator.png(data, type);
        contentType = 'image/png';
        break;
      case 'svg':
        result = BarcodeGenerator.svg(data, type);
        contentType = 'image/svg+xml';
        break;
      case 'html':
        result = BarcodeGenerator.html(data, type);
        contentType = 'text/html';
        break;
      default:
        return res.status(400).json({ error: 'Invalid format' });
    }

    res.set('Content-Type', contentType);
    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// QR code endpoint
app.get('/qr/:data', async (req, res) => {
  const { data } = req.params;
  const { size = 300, logo, label } = req.query;

  try {
    const qrCode = BarcodeGenerator.modernQr({
      data: decodeURIComponent(data),
      size: parseInt(size),
      logoPath: logo,
      label: label,
    });

    const result = await qrCode.generate();
    res.set('Content-Type', 'image/png');
    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Barcode server running on port 3000');
});
```

### Middleware Pattern

```javascript
const express = require('express');
const BarcodeGenerator = require('@isahaq/barcode');

const app = express();

// Barcode middleware
app.use('/api/barcode', (req, res, next) => {
  req.generateBarcode = (
    data,
    type = 'code128',
    format = 'png',
    options = {}
  ) => {
    try {
      switch (format) {
        case 'png':
          return BarcodeGenerator.png(data, type, options);
        case 'svg':
          return BarcodeGenerator.svg(data, type, options);
        case 'html':
          return BarcodeGenerator.html(data, type, options);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Generation failed: ${error.message}`);
    }
  };
  next();
});

// Route using middleware
app.get('/api/barcode/:data', (req, res) => {
  const { data } = req.params;
  const { type, format = 'png', width, height } = req.query;

  const options = {};
  if (width) options.width = parseInt(width);
  if (height) options.height = parseInt(height);

  try {
    const result = req.generateBarcode(data, type, format, options);
    const mimeTypes = {
      png: 'image/png',
      svg: 'image/svg+xml',
      html: 'text/html',
    };

    res.set('Content-Type', mimeTypes[format] || 'image/png');
    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 🖥️ CLI Usage

### Generate Barcodes

```bash
# Basic PNG barcode
barcode-generate barcode -d "1234567890" -t code128 -f png -o barcode.png

# SVG with custom dimensions
barcode-generate barcode -d "1234567890" -t ean13 -f svg -w 3 -h 150 -o barcode.svg

# Custom colors
barcode-generate barcode -d "1234567890" -t code128 \
  --foreground "#FF0000" --background "#FFFFFF" -o red-barcode.png
```

### Generate QR Codes

```bash
# Basic QR code
barcode-generate qr -d "https://example.com" -s 300 -o qr.png

# QR code with logo
barcode-generate qr -d "https://example.com" -s 300 \
  --logo "path/to/logo.png" --logo-size 60 -o qr-logo.png

# QR code with watermark
barcode-generate qr -d "https://example.com" -s 300 \
  --watermark "Company Name" --watermark-position bottom-center -o qr-watermark.png
```

### Batch Operations

```bash
# Create batch configuration file
cat > batch.json << EOF
[
  {"data": "1234567890", "type": "code128", "format": "png"},
  {"data": "9876543210", "type": "code39", "format": "svg"},
  {"data": "https://example.com", "type": "qrcode", "format": "png"}
]
EOF

# Generate batch
barcode-generate batch -i batch.json -o ./output
```

### Utility Commands

```bash
# List supported barcode types
barcode-generate types

# List output formats
barcode-generate formats

# Validate data for specific type
barcode-generate validate -d "1234567890" -t code128
```

---

## 📚 API Reference

### BarcodeGenerator (Static Methods)

#### Generation Methods

```javascript
BarcodeGenerator.png(data, type, options?)
  // Returns: Buffer

BarcodeGenerator.svg(data, type, options?)
  // Returns: String

BarcodeGenerator.html(data, type, options?)
  // Returns: String

BarcodeGenerator.pdf(data, type, options?)
  // Returns: Promise<Buffer>

BarcodeGenerator.modernQr(options)
  // Returns: QrCodeInstance
```

#### Utility Methods

```javascript
BarcodeGenerator.validate(data, type);
// Returns: { valid: boolean, error?: string, length?: number, charset?: string }

BarcodeGenerator.batch(items);
// Returns: Array<{ success: boolean, data?: Buffer|String, error?: string }>

BarcodeGenerator.getBarcodeTypes();
// Returns: Array<string>

BarcodeGenerator.getRenderFormats();
// Returns: Array<string>

BarcodeGenerator.getWatermarkPositions();
// Returns: Array<string>
```

### Options Object

```javascript
{
  // Dimensions
  width: 3,                    // Bar width
  height: 150,                 // Bar height

  // Display
  displayValue: true,          // Show text below barcode
  fontSize: 20,                // Text font size
  textAlign: 'center',         // 'left' | 'center' | 'right'
  textPosition: 'bottom',      // 'top' | 'bottom'
  textMargin: 2,               // Space between bars and text

  // Colors
  background: '#ffffff',       // Background color
  lineColor: '#000000',        // Bar color (alias: foregroundColor)

  // Margins
  margin: 10,                  // All sides
  marginTop: 10,               // Individual sides
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10
}
```

### QrCodeBuilder Methods

```javascript
QrCodeBuilder.create(options?)
  .data(string)                // Set data to encode
  .size(number)                // QR code size in pixels
  .margin(number)              // Margin size
  .errorCorrectionLevel(level) // 'L' | 'M' | 'Q' | 'H'
  .foregroundColor(rgb)        // [R, G, B]
  .backgroundColor(rgb)        // [R, G, B]
  .logoPath(string)            // Path to logo image
  .logoSize(number)            // Logo size percentage
  .label(string)               // Label text
  .watermark(text, position)   // Watermark text and position
  .format(format)              // 'png' | 'svg'
  .build()                     // Build QR code instance

// QR Code Instance Methods
qrCode.generate()              // Returns: Promise<Buffer>
qrCode.saveToFile(path)        // Returns: Promise<void>
qrCode.getDataUri()            // Returns: Promise<string>
qrCode.getString()             // Returns: Promise<string>
```

### Watermark Positions

```javascript
('top-left',
  'top-center',
  'top-right',
  'left-center',
  'center',
  'right-center',
  'bottom-left',
  'bottom-center',
  'bottom-right');
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please ensure your code:

- Follows the existing code style
- Includes tests for new features
- Updates documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with these excellent libraries:

- [JsBarcode](https://github.com/lindell/JsBarcode) - Barcode generation
- [node-qrcode](https://github.com/soldair/node-qrcode) - QR code generation
- [node-canvas](https://github.com/Automattic/node-canvas) - Canvas implementation
- [PDFKit](https://github.com/foliojs/pdfkit) - PDF generation

---

## 📞 Support

Need help? Here's how to get support:

1. 📖 Check the [documentation](README.md)
2. 🔍 Search [existing issues](https://github.com/isahaq1//npm-barcodegeneratop/issues)
3. 💬 Create a [new issue](https://github.com/isahaq1//npm-barcodegeneratop/issues/new)

---

<div align="center">

**Made with ❤️ by [Isahaq](https://github.com/isahaq1)**

[⭐ Star this repo](https://github.com/isahaq1//npm-barcodegeneratop) • [🐛 Report Bug](https://github.com/isahaq1//npm-barcodegeneratop/issues) • [✨ Request Feature](https://github.com/isahaq1//npm-barcodegeneratop/issues)

</div>
