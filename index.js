/**
 * Isahaq Barcode Generator
 * A universal barcode generator package supporting multiple barcode types and output formats
 */

const BarcodeService = require('./src/services/BarcodeService');
const QrCodeBuilder = require('./src/builders/QrCodeBuilder');
const { BarcodeTypes } = require('./src/types/BarcodeTypes');
const { RenderFormats } = require('./src/renderers/RenderFormats');

// Main service instance
const barcodeService = new BarcodeService();

/**
 * Main Barcode Generator Class
 */
class BarcodeGenerator {
  /**
   * Generate a barcode in PNG format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {Buffer} PNG buffer
   */
  static png(data, type = 'code128', options = {}) {
    return barcodeService.generate(data, type, 'png', options);
  }

  /**
   * Generate a barcode in SVG format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {string} SVG string
   */
  static svg(data, type = 'code128', options = {}) {
    return barcodeService.generate(data, type, 'svg', options);
  }

  /**
   * Generate a barcode in HTML format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {string} HTML string
   */
  static html(data, type = 'code128', options = {}) {
    return barcodeService.generate(data, type, 'html', options);
  }

  /**
   * Generate a barcode in PDF format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {Buffer} PDF buffer
   */
  static pdf(data, type = 'code128', options = {}) {
    return barcodeService.generate(data, type, 'pdf', options);
  }

  /**
   * Generate a QR code with advanced features
   * @param {Object} options - QR code options
   * @returns {Object} QR code result
   */
  static modernQr(options = {}) {
    return QrCodeBuilder.create(options);
  }

  /**
   * Get available barcode types
   * @returns {Array} Array of barcode types
   */
  static getBarcodeTypes() {
    return BarcodeTypes.getAll();
  }

  /**
   * Get available render formats
   * @returns {Array} Array of render formats
   */
  static getRenderFormats() {
    return RenderFormats.getAll();
  }

  /**
   * Validate data for a specific barcode type
   * @param {string} data - The data to validate
   * @param {string} type - The barcode type
   * @returns {Object} Validation result
   */
  static validate(data, type) {
    return barcodeService.validate(data, type);
  }

  /**
   * Generate multiple barcodes in batch
   * @param {Array} items - Array of barcode generation items
   * @returns {Array} Array of generated barcodes
   */
  static batch(items) {
    return barcodeService.batch(items);
  }

  /**
   * Get watermark positions for QR codes
   * @returns {Array} Array of watermark positions
   */
  static getWatermarkPositions() {
    return [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'center',
      'top-center',
      'bottom-center',
      'left-center',
      'right-center',
    ];
  }
}

// Export main class and utilities
module.exports = BarcodeGenerator;
module.exports.BarcodeGenerator = BarcodeGenerator;
module.exports.BarcodeService = BarcodeService;
module.exports.QrCodeBuilder = QrCodeBuilder;
module.exports.BarcodeTypes = BarcodeTypes;
module.exports.RenderFormats = RenderFormats;

// Default export
module.exports.default = BarcodeGenerator;
