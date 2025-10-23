/**
 * Barcode Service - Core service for barcode generation
 */

const { BarcodeTypes } = require('../types/BarcodeTypes');
const { RenderFormats } = require('../renderers/RenderFormats');
const PNGRenderer = require('../renderers/PNGRenderer');
const SVGRenderer = require('../renderers/SVGRenderer');
const HTMLRenderer = require('../renderers/HTMLRenderer');
const PDFRenderer = require('../renderers/PDFRenderer');
const { Validator } = require('../validators/Validator');

class BarcodeService {
  constructor() {
    this.renderers = {
      png: new PNGRenderer(),
      svg: new SVGRenderer(),
      html: new HTMLRenderer(),
      pdf: new PDFRenderer(),
    };
    this.validator = new Validator();
  }

  /**
   * Generate a barcode
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {string} format - The output format
   * @param {Object} options - Additional options
   * @returns {Buffer|string} Generated barcode
   */
  generate(data, type = 'code128', format = 'png', options = {}) {
    // Validate inputs
    if (!data || typeof data !== 'string') {
      throw new Error('Data must be a non-empty string');
    }

    if (!BarcodeTypes.isValid(type)) {
      throw new Error(
        `Invalid barcode type: ${type}. Supported types: ${BarcodeTypes.getAll().join(
          ', '
        )}`
      );
    }

    if (!RenderFormats.isValid(format)) {
      throw new Error(
        `Invalid format: ${format}. Supported formats: ${RenderFormats.getAll().join(
          ', '
        )}`
      );
    }

    // Validate data for the specific barcode type
    const validation = this.validator.validate(data, type);
    if (!validation.valid) {
      throw new Error(`Invalid data for ${type}: ${validation.error}`);
    }

    // Get renderer
    const renderer = this.renderers[format];
    if (!renderer) {
      throw new Error(`No renderer available for format: ${format}`);
    }

    // Generate barcode
    return renderer.render(data, type, options);
  }

  /**
   * Generate a barcode in PNG format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {Buffer} PNG buffer
   */
  png(data, type = 'code128', options = {}) {
    return this.generate(data, type, 'png', options);
  }

  /**
   * Generate a barcode in SVG format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {string} SVG string
   */
  svg(data, type = 'code128', options = {}) {
    return this.generate(data, type, 'svg', options);
  }

  /**
   * Generate a barcode in HTML format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {string} HTML string
   */
  html(data, type = 'code128', options = {}) {
    return this.generate(data, type, 'html', options);
  }

  /**
   * Generate a barcode in PDF format
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Additional options
   * @returns {Buffer} PDF buffer
   */
  pdf(data, type = 'code128', options = {}) {
    return this.generate(data, type, 'pdf', options);
  }

  /**
   * Generate multiple barcodes in batch
   * @param {Array} items - Array of barcode generation items
   * @returns {Array} Array of generated barcodes
   */
  batch(items) {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }

    return items.map((item, index) => {
      try {
        const { data, type = 'code128', format = 'png', options = {} } = item;
        return {
          index,
          success: true,
          result: this.generate(data, type, format, options),
          data,
          type,
          format,
        };
      } catch (error) {
        return {
          index,
          success: false,
          error: error.message,
          data: item.data,
          type: item.type || 'code128',
          format: item.format || 'png',
        };
      }
    });
  }

  /**
   * Validate data for a specific barcode type
   * @param {string} data - The data to validate
   * @param {string} type - The barcode type
   * @returns {Object} Validation result
   */
  validate(data, type) {
    return this.validator.validate(data, type);
  }

  /**
   * Get available barcode types
   * @returns {Array} Array of barcode types
   */
  getBarcodeTypes() {
    return BarcodeTypes.getAll();
  }

  /**
   * Get available render formats
   * @returns {Array} Array of render formats
   */
  getRenderFormats() {
    return RenderFormats.getAll();
  }
}

module.exports = BarcodeService;
