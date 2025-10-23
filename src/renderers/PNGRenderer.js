/**
 * PNG Renderer - Renders barcodes as PNG images
 */

const { createCanvas } = require("canvas");
const JsBarcode = require("jsbarcode");

class PNGRenderer {
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
   * Render a barcode as PNG
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {Buffer} PNG buffer
   */
  render(data, type, options = {}) {
    try {
      // Merge options with defaults
      const renderOptions = { ...this.defaultOptions, ...options };

      // Create canvas
      const canvas = createCanvas(400, 200);
      const ctx = canvas.getContext("2d");

      // Set background
      ctx.fillStyle = renderOptions.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      });

      // Convert to PNG buffer
      return canvas.toBuffer("image/png");
    } catch (error) {
      throw new Error(`PNG rendering failed: ${error.message}`);
    }
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

module.exports = PNGRenderer;
