/**
 * Barcode Types - Supported barcode types and their configurations
 */

class BarcodeTypes {
  static TYPES = {
    // Linear Barcodes
    CODE128: "code128",
    CODE128A: "code128a",
    CODE128B: "code128b",
    CODE128C: "code128c",
    CODE128AUTO: "code128auto",
    CODE39: "code39",
    CODE39EXTENDED: "code39extended",
    CODE39CHECKSUM: "code39checksum",
    CODE39AUTO: "code39auto",
    CODE93: "code93",
    CODE25: "code25",
    CODE25AUTO: "code25auto",
    CODE32: "code32",
    STANDARD25: "standard25",
    STANDARD25CHECKSUM: "standard25checksum",
    INTERLEAVED25: "interleaved25",
    INTERLEAVED25CHECKSUM: "interleaved25checksum",
    INTERLEAVED25AUTO: "interleaved25auto",
    MSI: "msi",
    MSICHECKSUM: "msichecksum",
    MSIAUTO: "msiauto",

    // EAN/UPC Family
    EAN13: "ean13",
    EAN8: "ean8",
    EAN2: "ean2",
    EAN5: "ean5",
    UPCA: "upca",
    UPCE: "upce",
    ITF14: "itf14",

    // Postal Barcodes
    POSTNET: "postnet",
    PLANET: "planet",
    RMS4CC: "rms4cc",
    KIX: "kix",
    IMB: "imb",

    // Specialized Barcodes
    CODABAR: "codabar",
    CODE11: "code11",
    PHARMACODE: "pharmacode",
    PHARMACODETWOTRACKS: "pharmacodetwotracks",

    // 2D Matrix Codes
    QRCODE: "qrcode",
    DATAMATRIX: "datamatrix",
    AZTEC: "aztec",
    PDF417: "pdf417",
    MICROQR: "microqr",
    MAXICODE: "maxicode",

    // Stacked Linear Codes
    CODE16K: "code16k",
    CODE49: "code49",
  };

  static CATEGORIES = {
    LINEAR: [
      "code128",
      "code128a",
      "code128b",
      "code128c",
      "code128auto",
      "code39",
      "code39extended",
      "code39checksum",
      "code39auto",
      "code93",
      "code25",
      "code25auto",
      "code32",
      "standard25",
      "standard25checksum",
      "interleaved25",
      "interleaved25checksum",
      "interleaved25auto",
      "msi",
      "msichecksum",
      "msiauto",
    ],
    EAN_UPC: ["ean13", "ean8", "ean2", "ean5", "upca", "upce", "itf14"],
    POSTAL: ["postnet", "planet", "rms4cc", "kix", "imb"],
    SPECIALIZED: ["codabar", "code11", "pharmacode", "pharmacodetwotracks"],
    MATRIX_2D: [
      "qrcode",
      "datamatrix",
      "aztec",
      "pdf417",
      "microqr",
      "maxicode",
    ],
    STACKED: ["code16k", "code49"],
  };

  /**
   * Get all supported barcode types
   * @returns {Array} Array of all barcode types
   */
  static getAll() {
    return Object.values(this.TYPES);
  }

  /**
   * Get barcode types by category
   * @param {string} category - The category name
   * @returns {Array} Array of barcode types in the category
   */
  static getByCategory(category) {
    return this.CATEGORIES[category.toUpperCase()] || [];
  }

  /**
   * Get all categories
   * @returns {Array} Array of category names
   */
  static getCategories() {
    return Object.keys(this.CATEGORIES);
  }

  /**
   * Check if a barcode type is valid
   * @param {string} type - The barcode type to check
   * @returns {boolean} True if valid
   */
  static isValid(type) {
    return Object.values(this.TYPES).includes(type);
  }

  /**
   * Get barcode type configuration
   * @param {string} type - The barcode type
   * @returns {Object} Configuration object
   */
  static getConfig(type) {
    const configs = {
      code128: { minLength: 1, maxLength: 80, charset: "ASCII" },
      code128a: { minLength: 1, maxLength: 80, charset: "ASCII A" },
      code128b: { minLength: 1, maxLength: 80, charset: "ASCII B" },
      code128c: { minLength: 2, maxLength: 80, charset: "Numeric" },
      code39: {
        minLength: 1,
        maxLength: 43,
        charset: "0-9, A-Z, space, -.$/+%",
      },
      code39extended: {
        minLength: 1,
        maxLength: 43,
        charset: "Extended ASCII",
      },
      code93: { minLength: 1, maxLength: 43, charset: "0-9, A-Z, -.$/+%" },
      ean13: { minLength: 12, maxLength: 13, charset: "Numeric" },
      ean8: { minLength: 7, maxLength: 8, charset: "Numeric" },
      upca: { minLength: 11, maxLength: 12, charset: "Numeric" },
      upce: { minLength: 6, maxLength: 8, charset: "Numeric" },
      qrcode: { minLength: 1, maxLength: 2953, charset: "Unicode" },
      datamatrix: { minLength: 1, maxLength: 2335, charset: "Unicode" },
      pdf417: { minLength: 1, maxLength: 1850, charset: "Unicode" },
    };

    return (
      configs[type] || { minLength: 1, maxLength: 100, charset: "Unknown" }
    );
  }

  /**
   * Get barcode type description
   * @param {string} type - The barcode type
   * @returns {string} Description
   */
  static getDescription(type) {
    const descriptions = {
      code128: "Code 128 - High-density linear barcode",
      code39: "Code 39 - Alphanumeric barcode",
      ean13: "EAN-13 - European Article Number",
      ean8: "EAN-8 - European Article Number (short)",
      upca: "UPC-A - Universal Product Code",
      upce: "UPC-E - Universal Product Code (compressed)",
      qrcode: "QR Code - 2D matrix barcode",
      datamatrix: "Data Matrix - 2D matrix barcode",
      pdf417: "PDF417 - 2D stacked barcode",
    };

    return descriptions[type] || "Unknown barcode type";
  }
}

module.exports = { BarcodeTypes };
