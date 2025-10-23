/**
 * Isahaq Barcode Generator
 * A universal barcode generator package supporting multiple barcode types and output formats
 */

// Detect environment
const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

if (isBrowser) {
  // Browser environment - use browser-compatible version
  module.exports = require('./browser');
} else {
  // Node.js environment - use full-featured version
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
     * @param {Object} options - Generation options
     * @returns {Buffer} PNG buffer
     */
    static png(data, type = 'code128', options = {}) {
      return barcodeService.generate(data, type, 'png', options);
    }

    /**
     * Generate a barcode in SVG format
     * @param {string} data - The data to encode
     * @param {string} type - The barcode type
     * @param {Object} options - Generation options
     * @returns {string} SVG string
     */
    static svg(data, type = 'code128', options = {}) {
      return barcodeService.generate(data, type, 'svg', options);
    }

    /**
     * Generate a barcode in HTML format
     * @param {string} data - The data to encode
     * @param {string} type - The barcode type
     * @param {Object} options - Generation options
     * @returns {string} HTML string
     */
    static html(data, type = 'code128', options = {}) {
      return barcodeService.generate(data, type, 'html', options);
    }

    /**
     * Generate a barcode in PDF format
     * @param {string} data - The data to encode
     * @param {string} type - The barcode type
     * @param {Object} options - Generation options
     * @returns {Promise<Buffer>} PDF buffer
     */
    static async pdf(data, type = 'code128', options = {}) {
      return barcodeService.generate(data, type, 'pdf', options);
    }

    /**
     * Generate a QR code
     * @param {string} data - The data to encode
     * @param {Object} options - Generation options
     * @returns {QrCodeBuilder} QR code builder instance
     */
    static qrCode(data, options = {}) {
      return new QrCodeBuilder({ data, ...options });
    }

    /**
     * Validate barcode data
     * @param {string} data - The data to validate
     * @param {string} type - The barcode type
     * @returns {Object} Validation result
     */
    static validate(data, type) {
      return barcodeService.validate(data, type);
    }

    /**
     * Generate multiple barcodes in batch
     * @param {Array} items - Array of barcode configurations
     * @returns {Promise<Array>} Array of generated barcodes
     */
    static async batch(items) {
      return barcodeService.batch(items);
    }

    /**
     * Get supported barcode types
     * @returns {Array} Array of supported types
     */
    static getBarcodeTypes() {
      return BarcodeTypes.getTypes();
    }

    /**
     * Get supported render formats
     * @returns {Array} Array of supported formats
     */
    static getRenderFormats() {
      return RenderFormats.getFormats();
    }

    /**
     * Get watermark positions
     * @returns {Array} Array of watermark positions
     */
    static getWatermarkPositions() {
      return [
        'top-left',
        'top-center',
        'top-right',
        'left-center',
        'center',
        'right-center',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ];
    }

    /**
     * Get barcode type information
     * @param {string} type - The barcode type
     * @returns {Object} Type information
     */
    static getBarcodeTypeInfo(type) {
      return BarcodeTypes.getTypeInfo(type);
    }

    /**
     * Get render format information
     * @param {string} format - The render format
     * @returns {Object} Format information
     */
    static getRenderFormatInfo(format) {
      return RenderFormats.getFormatInfo(format);
    }
  }

  module.exports = BarcodeGenerator;
}
