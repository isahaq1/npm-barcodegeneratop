/**
 * Browser-compatible version of Isahaq Barcode Generator
 * This version uses client-side libraries instead of Node.js modules
 */

// Browser-compatible QR code generation
const QRCode = require('qrcode');

// Browser-compatible barcode generation using jsbarcode
const JsBarcode = require('jsbarcode');

class BrowserBarcodeGenerator {
  /**
   * Generate PNG barcode (browser-compatible)
   * @param {string} data - Data to encode
   * @param {string} type - Barcode type
   * @param {Object} options - Options
   * @returns {Promise<Buffer>} PNG buffer
   */
  static async png(data, type = 'code128', options = {}) {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');

      // Generate barcode using jsbarcode
      JsBarcode(canvas, data, {
        format: type.toUpperCase(),
        width: options.width || 2,
        height: options.height || 100,
        displayValue: options.displayValue !== false,
        fontSize: options.fontSize || 20,
        textAlign: options.textAlign || 'center',
        textPosition: options.textPosition || 'bottom',
        textMargin: options.textMargin || 2,
        background: options.background || '#ffffff',
        lineColor: options.lineColor || '#000000',
        margin: options.margin || 10,
        ...options,
      });

      // Convert canvas to blob
      return new Promise(resolve => {
        canvas.toBlob(blob => {
          const reader = new FileReader();
          reader.onload = () => resolve(Buffer.from(reader.result));
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      });
    } catch (error) {
      throw new Error(`Failed to generate PNG barcode: ${error.message}`);
    }
  }

  /**
   * Generate SVG barcode (browser-compatible)
   * @param {string} data - Data to encode
   * @param {string} type - Barcode type
   * @param {Object} options - Options
   * @returns {string} SVG string
   */
  static svg(data, type = 'code128', options = {}) {
    try {
      // Create a temporary div to hold the SVG
      const tempDiv = document.createElement('div');

      // Generate barcode using jsbarcode
      JsBarcode(tempDiv, data, {
        format: type.toUpperCase(),
        width: options.width || 2,
        height: options.height || 100,
        displayValue: options.displayValue !== false,
        fontSize: options.fontSize || 20,
        textAlign: options.textAlign || 'center',
        textPosition: options.textPosition || 'bottom',
        textMargin: options.textMargin || 2,
        background: options.background || '#ffffff',
        lineColor: options.lineColor || '#000000',
        margin: options.margin || 10,
        xmlDocument: document,
        ...options,
      });

      return tempDiv.innerHTML;
    } catch (error) {
      throw new Error(`Failed to generate SVG barcode: ${error.message}`);
    }
  }

  /**
   * Generate HTML barcode (browser-compatible)
   * @param {string} data - Data to encode
   * @param {string} type - Barcode type
   * @param {Object} options - Options
   * @returns {string} HTML string
   */
  static html(data, type = 'code128', options = {}) {
    const svg = this.svg(data, type, options);
    return `<div class="barcode-container">${svg}</div>`;
  }

  /**
   * Generate QR code (browser-compatible)
   * @param {string} data - Data to encode
   * @param {Object} options - Options
   * @returns {Promise<Buffer>} PNG buffer
   */
  static async qrCode(data, options = {}) {
    try {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, data, {
        width: options.size || 300,
        margin: options.margin || 10,
        color: {
          dark: options.foregroundColor || '#000000',
          light: options.backgroundColor || '#FFFFFF',
        },
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
        ...options,
      });

      return new Promise(resolve => {
        canvas.toBlob(blob => {
          const reader = new FileReader();
          reader.onload = () => resolve(Buffer.from(reader.result));
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      });
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  /**
   * Validate barcode data (browser-compatible)
   * @param {string} data - Data to validate
   * @param {string} type - Barcode type
   * @returns {Object} Validation result
   */
  static validate(data, type) {
    if (!data || typeof data !== 'string') {
      return {
        valid: false,
        error: 'Data must be a non-empty string',
      };
    }

    // Basic validation for common barcode types
    switch (type.toLowerCase()) {
      case 'code128':
        if (!/^[\x00-\x7F]+$/.test(data)) {
          return {
            valid: false,
            error: 'Code 128 supports ASCII characters only',
          };
        }
        break;
      case 'code39':
        if (!/^[A-Z0-9\s\-\.\$\/\+\%]+$/.test(data)) {
          return {
            valid: false,
            error: 'Code 39 supports characters: A-Z, 0-9, space, -.$/+%',
          };
        }
        break;
      case 'ean13':
        if (!/^\d{12,13}$/.test(data)) {
          return {
            valid: false,
            error: 'EAN-13 must be 12 or 13 digits',
          };
        }
        break;
      case 'qrcode':
        if (data.length === 0) {
          return {
            valid: false,
            error: 'QR Code data cannot be empty',
          };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * Get supported barcode types
   * @returns {Array} Array of supported types
   */
  static getBarcodeTypes() {
    return [
      'code128',
      'code128a',
      'code128b',
      'code128c',
      'code128auto',
      'code39',
      'code39extended',
      'code39checksum',
      'code39auto',
      'code93',
      'ean13',
      'ean8',
      'upca',
      'upce',
      'codabar',
      'code11',
      'msi',
      'pharmazentral',
      'interleaved25',
      'standard25',
      'qrcode',
      'datamatrix',
      'pdf417',
      'aztec',
    ];
  }

  /**
   * Get supported render formats
   * @returns {Array} Array of supported formats
   */
  static getRenderFormats() {
    return ['png', 'svg', 'html'];
  }
}

module.exports = BrowserBarcodeGenerator;
