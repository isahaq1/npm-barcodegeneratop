/**
 * SVG Renderer - Renders barcodes as SVG
 */

const JsBarcode = require("jsbarcode");

class SVGRenderer {
  constructor() {
    this.defaultOptions = {
      width: 2,
      height: 100,
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
  }

  /**
   * Render a barcode as SVG
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {string} SVG string
   */
  render(data, type, options = {}) {
    try {
      // Merge options with defaults
      const renderOptions = { ...this.defaultOptions, ...options };

      // Create a temporary canvas element for JsBarcode
      const canvas = document.createElement("canvas");

      // Generate barcode using JsBarcode
      JsBarcode(canvas, data, {
        format: this.mapBarcodeType(type),
        width: renderOptions.width,
        height: renderOptions.height,
        displayValue: renderOptions.displayValue,
        fontSize: renderOptions.fontSize,
        textAlign: renderOptions.textAlign,
        textPosition: renderOptions.textPosition,
        textMargin: renderOptions.textMargin,
        background: renderOptions.background,
        lineColor: renderOptions.lineColor,
        margin: renderOptions.margin,
        marginTop: renderOptions.marginTop,
        marginBottom: renderOptions.marginBottom,
        marginLeft: renderOptions.marginLeft,
        marginRight: renderOptions.marginRight,
        xmlDocument: this.createXMLDocument(),
      });

      // Get SVG string from canvas
      const svgString = canvas.toSVG();
      return svgString;
    } catch (error) {
      // Fallback: create SVG manually
      return this.createManualSVG(data, type, options);
    }
  }

  /**
   * Create SVG manually as fallback
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {string} SVG string
   */
  createManualSVG(data, type, options = {}) {
    const renderOptions = { ...this.defaultOptions, ...options };

    // Simple SVG structure for basic barcodes
    const width = 300;
    const height = renderOptions.height + (renderOptions.displayValue ? 30 : 0);

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${width}" height="${height}" fill="${renderOptions.background}"/>`;

    // Add barcode representation (simplified)
    if (type === "qrcode") {
      svg += this.createQRCodeSVG(data, width, height, renderOptions);
    } else {
      svg += this.createLinearBarcodeSVG(data, width, height, renderOptions);
    }

    // Add text if displayValue is true
    if (renderOptions.displayValue) {
      svg += `<text x="${width / 2}" y="${
        height - 5
      }" text-anchor="middle" font-family="Arial" font-size="${
        renderOptions.fontSize
      }" fill="${renderOptions.lineColor}">${data}</text>`;
    }

    svg += "</svg>";
    return svg;
  }

  /**
   * Create QR Code SVG representation
   * @param {string} data - The data to encode
   * @param {number} width - SVG width
   * @param {number} height - SVG height
   * @param {Object} options - Render options
   * @returns {string} SVG content
   */
  createQRCodeSVG(data, width, height, options) {
    // This is a simplified representation
    // In a real implementation, you would use a QR code library
    const size = Math.min(width, height) - 40;
    const x = (width - size) / 2;
    const y = (height - size) / 2;

    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${options.lineColor}" stroke="${options.lineColor}" stroke-width="1"/>`;
  }

  /**
   * Create linear barcode SVG representation
   * @param {string} data - The data to encode
   * @param {number} width - SVG width
   * @param {number} height - SVG height
   * @param {Object} options - Render options
   * @returns {string} SVG content
   */
  createLinearBarcodeSVG(data, width, height, options) {
    // This is a simplified representation
    // In a real implementation, you would use a barcode library
    const barWidth = 2;
    const barHeight = height - (options.displayValue ? 30 : 0);
    const startX = 20;
    let currentX = startX;

    let svg = "";
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const barCount = (char % 5) + 1;

      for (let j = 0; j < barCount; j++) {
        svg += `<rect x="${currentX}" y="10" width="${barWidth}" height="${barHeight}" fill="${options.lineColor}"/>`;
        currentX += barWidth * 2;
      }
    }

    return svg;
  }

  /**
   * Create XML document for JsBarcode
   * @returns {Object} XML document
   */
  createXMLDocument() {
    // Create a minimal XML document for JsBarcode
    return {
      createElement: (tagName) => ({
        tagName,
        setAttribute: () => {},
        appendChild: () => {},
        toSVG: () => "<svg></svg>",
      }),
    };
  }

  /**
   * Map barcode type to JsBarcode format
   * @param {string} type - The barcode type
   * @returns {string} JsBarcode format
   */
  mapBarcodeType(type) {
    const typeMap = {
      code128: "CODE128",
      code128a: "CODE128A",
      code128b: "CODE128B",
      code128c: "CODE128C",
      code128auto: "CODE128",
      code39: "CODE39",
      code39extended: "CODE39",
      code39checksum: "CODE39",
      code39auto: "CODE39",
      code93: "CODE93",
      ean13: "EAN13",
      ean8: "EAN8",
      upca: "UPC",
      upce: "UPC",
      codabar: "codabar",
      code11: "CODE11",
      msi: "MSI",
      pharmazentral: "pharmazentral",
      interleaved25: "ITF",
      standard25: "STD25",
    };

    return typeMap[type] || "CODE128";
  }

  /**
   * Get default options
   * @returns {Object} Default options
   */
  getDefaultOptions() {
    return { ...this.defaultOptions };
  }

  /**
   * Set default options
   * @param {Object} options - New default options
   */
  setDefaultOptions(options) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

module.exports = SVGRenderer;
