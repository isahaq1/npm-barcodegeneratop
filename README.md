# Isahaq Barcode Generator

A universal barcode generator package supporting **32+ barcode types** (linear, 2D, postal, stacked, and auto-detection variants), multiple output formats, CLI, and Express.js integration.

## 🚀 Features

- **32+ Barcode Types**: Linear, 2D, postal, stacked, and auto-detection variants
- **Multiple Output Formats**: PNG, SVG, HTML, JPG, PDF
- **Express.js Integration**: Middleware and route helpers
- **CLI Tool**: Command-line interface for quick barcode generation
- **QR Code Builder**: Fluent API for advanced QR code generation
- **Validation**: Built-in data validation for different barcode types
- **Customization**: Size, colors, margins, and more options
- **Batch Generation**: Generate multiple barcodes at once
- **Watermarking**: Add logos and watermarks to QR codes

## 📦 Installation

### Via npm

```bash
npm install isahaq-barcode
```

### Requirements

- Node.js 14.0 or higher
- Canvas library (automatically installed)

## 🔧 Why Use This Package?

1. **Comprehensive Support**: 32+ barcode types including industry standards and auto-detection
2. **Multiple Formats**: Generate barcodes in PNG, SVG, HTML, JPG, and PDF
3. **Express.js Ready**: Seamless integration with Express.js framework
4. **CLI Support**: Generate barcodes from command line
5. **Advanced QR Codes**: Customizable QR codes with logos and labels
6. **Validation**: Built-in data validation for each barcode type
7. **Performance**: Optimized for high-volume generation
8. **Extensible**: Easy to add new barcode types and renderers

## 📋 Supported Barcode Types (32+ Types)

### Linear Barcodes

- **Code128** (A, B, C, Auto)
- **Code39** (Standard, Checksum, Extended, Auto)
- **Code93**
- **Code25** (Standard, Auto)
- **Code32** (Italian Pharmacode)
- **Standard25** (Standard, Checksum)
- **Interleaved25** (Standard, Checksum, Auto)
- **MSI** (Standard, Checksum, Auto)

### EAN/UPC Family

- **EAN13**, **EAN8**, **EAN2**, **EAN5**
- **UPC-A**, **UPC-E**
- **ITF14**

### Postal Barcodes

- **POSTNET**, **PLANET**, **RMS4CC**, **KIX**, **IMB**

### Specialized Barcodes

- **Codabar**, **Code11**, **PharmaCode**, **PharmaCodeTwoTracks**

### 2D Matrix Codes

- **QRCode**, **DataMatrix**, **Aztec**, **PDF417**, **MicroQR**, **Maxicode**

### Stacked Linear Codes

- **Code16K**, **Code49**

## 🛠️ Usage

### Basic Node.js Usage

```javascript
const BarcodeGenerator = require("isahaq-barcode");

// Generate PNG barcode
const pngBuffer = BarcodeGenerator.png("1234567890", "code128");

// Generate SVG barcode
const svgString = BarcodeGenerator.svg("1234567890", "ean13");

// Generate HTML barcode
const htmlString = BarcodeGenerator.html("1234567890", "code39");

// Generate PDF barcode
const pdfBuffer = await BarcodeGenerator.pdf("1234567890", "code128");
```

### Display Barcode as Base64 Image (PNG)

```javascript
const BarcodeGenerator = require("isahaq-barcode");

// Generate barcode
const barcodeBuffer = BarcodeGenerator.png("1234567890", "code128");

// Convert to base64
const barcodeImage = barcodeBuffer.toString("base64");
console.log(
  `<img src="data:image/png;base64,${barcodeImage}" alt="Barcode" />`
);

// With custom options
const customBarcode = BarcodeGenerator.png("1234567890", "code128", {
  width: 3,
  height: 150,
  displayValue: false,
  foregroundColor: "#FF0000",
  backgroundColor: "#FFFFFF",
});
```

### QR Code with Logo and Watermark

```javascript
const BarcodeGenerator = require("isahaq-barcode");

const qrCode = BarcodeGenerator.modernQr({
  data: "https://example.com",
  size: 300,
  margin: 10,
  foregroundColor: [0, 0, 0],
  backgroundColor: [255, 255, 255],
  logoPath: "path/to/logo.png", // Logo in the center
  logoSize: 60, // Logo size as percentage
  label: "Scan me!", // Label below QR code
  watermark: "Watermark Text", // Watermark
  watermarkPosition: "center",
  errorCorrectionLevel: "H", // Use H for better logo support
});

// Save to file
await qrCode.saveToFile("qr-code-with-logo.png");

// Get as data URI
const dataUri = await qrCode.getDataUri();
console.log(`<img src="${dataUri}" alt="QR Code with Logo" />`);
```

### Using the Service Class

```javascript
const { BarcodeService } = require("isahaq-barcode");

const barcodeService = new BarcodeService();

// Generate different formats
const pngData = barcodeService.png("1234567890", "code128");
const svgData = barcodeService.svg("1234567890", "ean13");
const htmlData = barcodeService.html("1234567890", "code39");

// Generate with custom options
const options = {
  width: 300,
  height: 100,
  displayValue: true,
  foregroundColor: "#000000",
  backgroundColor: "#FFFFFF",
};
const customBarcode = barcodeService.generate(
  "1234567890",
  "code128",
  "png",
  options
);
```

### QR Code Builder (Advanced)

```javascript
const { QrCodeBuilder } = require("isahaq-barcode");

const qrCode = QrCodeBuilder.create()
  .data("https://example.com")
  .size(300)
  .margin(10)
  .foregroundColor([0, 0, 0])
  .backgroundColor([255, 255, 255])
  .logoPath("path/to/logo.png")
  .logoSize(60)
  .label("Scan me!")
  .watermark("Watermark Text", "center")
  .format("png")
  .build();

// Save to file
await qrCode.saveToFile("qr-code.png");

// Get data URI
const dataUri = await qrCode.getDataUri();
console.log(`<img src="${dataUri}" alt="QR Code">`);
```

## 🎯 Express.js Integration

### Basic Express.js Usage

```javascript
const express = require('express')
const BarcodeGenerator = require('isahaq-barcode')

const app = express()

// Generate barcode endpoint
app.get('/barcode/:data', (req, res) => {
  const { data } = req.params
  const { type = 'code128', format = 'png' } = req.query

  try {
    let result
    switch (format) {
      case 'png':
        result = BarcodeGenerator.png(data, type)
        res.set('Content-Type', 'image/png')
        break
      case 'svg':
        result = BarcodeGenerator.svg(data, type)
        res.set('Content-Type', 'image/svg+xml')
        break
      case 'html':
        result = BarcodeGenerator.html(data, type)
        res.set('Content-Type', 'text/html')
        break
      default:
        throw new Error(`Unsupported format: ${format}`)
    }

    res.send(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Generate QR code endpoint
app.get('/qr/:data', (req, res) => {
  const { data } = req.params
  const { size = 300, logo, label } = req.query

  try {
    const qrOptions = {
      data: decodeURIComponent(data),
      size: parseInt(size),
      logoPath: logo,
      label: label
    }

    const qrCode = BarcodeGenerator.modernQr(qrOptions)
    const result = await qrCode.generate()

    res.set('Content-Type', 'image/png')
    res.send(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

### Express.js Middleware

```javascript
const express = require("express");
const BarcodeGenerator = require("isahaq-barcode");

const app = express();

// Barcode middleware
app.use("/api/barcode", (req, res, next) => {
  req.generateBarcode = (
    data,
    type = "code128",
    format = "png",
    options = {}
  ) => {
    try {
      switch (format) {
        case "png":
          return BarcodeGenerator.png(data, type, options);
        case "svg":
          return BarcodeGenerator.svg(data, type, options);
        case "html":
          return BarcodeGenerator.html(data, type, options);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Barcode generation failed: ${error.message}`);
    }
  };
  next();
});

// Use the middleware
app.get("/api/barcode/:data", (req, res) => {
  const { data } = req.params;
  const { type, format, width, height } = req.query;

  const options = {};
  if (width) options.width = parseInt(width);
  if (height) options.height = parseInt(height);

  try {
    const result = req.generateBarcode(data, type, format, options);
    res.set("Content-Type", getMimeType(format));
    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function getMimeType(format) {
  const mimeTypes = {
    png: "image/png",
    svg: "image/svg+xml",
    html: "text/html",
  };
  return mimeTypes[format] || "image/png";
}
```

## 🖥️ CLI Usage

### Install CLI globally

```bash
npm install -g isahaq-barcode
```

### Generate Barcode

```bash
# Generate PNG barcode
barcode-generate barcode -d "1234567890" -t code128 -f png -o barcode.png

# Generate SVG barcode
barcode-generate barcode -d "1234567890" -t ean13 -f svg -o barcode.svg

# Generate with custom options
barcode-generate barcode -d "1234567890" -t code128 -f png -w 3 -h 150 --foreground "#FF0000" --background "#FFFFFF"
```

### Generate QR Code

```bash
# Generate QR code
barcode-generate qr -d "https://example.com" -s 300 -f png -o qr.png

# Generate QR code with logo
barcode-generate qr -d "https://example.com" -s 300 --logo "path/to/logo.png" --logo-size 60 -o qr-with-logo.png

# Generate QR code with watermark
barcode-generate qr -d "https://example.com" -s 300 --watermark "Watermark Text" --watermark-position center -o qr-with-watermark.png
```

### Batch Generation

```bash
# Create batch file (batch.json)
echo '[
  {"data": "1234567890", "type": "code128", "format": "png"},
  {"data": "9876543210", "type": "code39", "format": "svg"},
  {"data": "https://example.com", "type": "qrcode", "format": "png"}
]' > batch.json

# Generate batch
barcode-generate batch -i batch.json -o ./output
```

### List Supported Types and Formats

```bash
# List barcode types
barcode-generate types

# List output formats
barcode-generate formats

# Validate data
barcode-generate validate -d "1234567890" -t code128
```

## 📊 Advanced Features

### Batch Generation

```javascript
const BarcodeGenerator = require("isahaq-barcode");

const items = [
  { data: "1234567890", type: "code128", format: "png" },
  { data: "9876543210", type: "code39", format: "svg" },
  { data: "https://example.com", type: "qrcode", format: "png" },
];

const results = BarcodeGenerator.batch(items);
results.forEach((result, index) => {
  if (result.success) {
    console.log(`Barcode ${index} generated successfully`);
  } else {
    console.error(`Barcode ${index} failed: ${result.error}`);
  }
});
```

### Validation

```javascript
const BarcodeGenerator = require("isahaq-barcode");

// Validate data for specific barcode type
const validation = BarcodeGenerator.validate("1234567890", "code128");
if (validation.valid) {
  console.log("Data is valid");
  console.log(`Length: ${validation.length}`);
  console.log(`Charset: ${validation.charset}`);
} else {
  console.error(`Invalid data: ${validation.error}`);
}
```

### Custom Renderer Options

```javascript
const BarcodeGenerator = require("isahaq-barcode");

const options = {
  width: 3,
  height: 150,
  displayValue: true,
  fontSize: 20,
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
};

const barcode = BarcodeGenerator.png("1234567890", "code128", options);
```

### Available Watermark Positions

```javascript
const BarcodeGenerator = require("isahaq-barcode");

const positions = BarcodeGenerator.getWatermarkPositions();
// Returns: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center',
//           'top-center', 'bottom-center', 'left-center', 'right-center']
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 API Reference

### BarcodeGenerator

#### Methods

- `png(data, type, options)` - Generate PNG barcode
- `svg(data, type, options)` - Generate SVG barcode
- `html(data, type, options)` - Generate HTML barcode
- `pdf(data, type, options)` - Generate PDF barcode
- `modernQr(options)` - Generate QR code with advanced features
- `validate(data, type)` - Validate data for barcode type
- `batch(items)` - Generate multiple barcodes
- `getBarcodeTypes()` - Get supported barcode types
- `getRenderFormats()` - Get supported output formats
- `getWatermarkPositions()` - Get watermark positions

### QrCodeBuilder

#### Methods

- `create(options)` - Create new builder instance
- `data(data)` - Set data to encode
- `size(size)` - Set QR code size
- `margin(margin)` - Set margin
- `errorCorrectionLevel(level)` - Set error correction level
- `foregroundColor(color)` - Set foreground color
- `backgroundColor(color)` - Set background color
- `logoPath(path)` - Set logo path
- `logoSize(size)` - Set logo size
- `label(text)` - Set label text
- `watermark(text, position)` - Set watermark
- `format(format)` - Set output format
- `build()` - Build QR code
- `generate()` - Generate QR code buffer
- `saveToFile(path)` - Save to file
- `getDataUri()` - Get data URI
- `getString()` - Get QR code string

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [JsBarcode](https://github.com/lindell/JsBarcode) - Barcode generation library
- [QRCode](https://github.com/soldair/node-qrcode) - QR code generation library
- [Canvas](https://github.com/Automattic/node-canvas) - Canvas implementation for Node.js
- [PDFKit](https://github.com/foliojs/pdfkit) - PDF generation library

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/isahaq1/barcode-generator-npm/issues)
3. Create a [new issue](https://github.com/isahaq1/barcode-generator-npm/issues/new)

---

**Made with ❤️ by [Isahaq](https://github.com/isahaq1)**
#   n p m - b a r c o d e g e n e r a t o p  
 