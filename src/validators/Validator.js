/**
 * Validator - Data validation for different barcode types
 */

const { BarcodeTypes } = require("../types/BarcodeTypes");

class Validator {
  constructor() {
    this.patterns = {
      // Numeric patterns
      numeric: /^[0-9]+$/,
      // Alphanumeric patterns
      alphanumeric: /^[A-Za-z0-9]+$/,
      // Code 39 pattern
      code39: /^[A-Z0-9\s\-\.\$\/\+\%]+$/,
      // Code 39 extended pattern
      code39extended: /^[\x00-\x7F]+$/,
      // EAN/UPC patterns
      ean13: /^[0-9]{12,13}$/,
      ean8: /^[0-9]{7,8}$/,
      upca: /^[0-9]{11,12}$/,
      upce: /^[0-9]{6,8}$/,
      // QR Code pattern (supports Unicode)
      qrcode: /^[\s\S]+$/,
      // Data Matrix pattern
      datamatrix: /^[\s\S]+$/,
      // PDF417 pattern
      pdf417: /^[\s\S]+$/,
    };
  }

  /**
   * Validate data for a specific barcode type
   * @param {string} data - The data to validate
   * @param {string} type - The barcode type
   * @returns {Object} Validation result
   */
  validate(data, type) {
    if (!data || typeof data !== "string") {
      return {
        valid: false,
        error: "Data must be a non-empty string",
      };
    }

    if (!BarcodeTypes.isValid(type)) {
      return {
        valid: false,
        error: `Invalid barcode type: ${type}`,
      };
    }

    // Get configuration for the barcode type
    const config = BarcodeTypes.getConfig(type);

    // Check length constraints
    if (data.length < config.minLength) {
      return {
        valid: false,
        error: `Data too short. Minimum length: ${config.minLength}`,
      };
    }

    if (data.length > config.maxLength) {
      return {
        valid: false,
        error: `Data too long. Maximum length: ${config.maxLength}`,
      };
    }

    // Type-specific validation
    const validationResult = this.validateByType(data, type);
    if (!validationResult.valid) {
      return validationResult;
    }

    return {
      valid: true,
      data,
      type,
      length: data.length,
      charset: config.charset,
    };
  }

  /**
   * Validate data by barcode type
   * @param {string} data - The data to validate
   * @param {string} type - The barcode type
   * @returns {Object} Validation result
   */
  validateByType(data, type) {
    switch (type) {
      case "code128":
      case "code128a":
      case "code128b":
      case "code128c":
      case "code128auto":
        return this.validateCode128(data, type);

      case "code39":
      case "code39extended":
      case "code39checksum":
      case "code39auto":
        return this.validateCode39(data, type);

      case "code93":
        return this.validateCode93(data);

      case "ean13":
        return this.validateEAN13(data);

      case "ean8":
        return this.validateEAN8(data);

      case "upca":
        return this.validateUPCA(data);

      case "upce":
        return this.validateUPCE(data);

      case "qrcode":
        return this.validateQRCode(data);

      case "datamatrix":
        return this.validateDataMatrix(data);

      case "pdf417":
        return this.validatePDF417(data);

      default:
        // For other types, just check if data is not empty
        return {
          valid: data.length > 0,
          error: data.length === 0 ? "Data cannot be empty" : null,
        };
    }
  }

  /**
   * Validate Code 128 data
   * @param {string} data - The data to validate
   * @param {string} type - The Code 128 variant
   * @returns {Object} Validation result
   */
  validateCode128(data, type) {
    // Code 128 supports ASCII characters
    if (!/^[\x00-\x7F]+$/.test(data)) {
      return {
        valid: false,
        error: "Code 128 supports ASCII characters only",
      };
    }

    return { valid: true };
  }

  /**
   * Validate Code 39 data
   * @param {string} data - The data to validate
   * @param {string} type - The Code 39 variant
   * @returns {Object} Validation result
   */
  validateCode39(data, type) {
    if (type === "code39extended") {
      // Extended Code 39 supports full ASCII
      if (!/^[\x00-\x7F]+$/.test(data)) {
        return {
          valid: false,
          error: "Extended Code 39 supports ASCII characters only",
        };
      }
    } else {
      // Standard Code 39 supports limited character set
      if (!this.patterns.code39.test(data)) {
        return {
          valid: false,
          error: "Code 39 supports characters: A-Z, 0-9, space, -.$/+%",
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate Code 93 data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateCode93(data) {
    if (!this.patterns.alphanumeric.test(data)) {
      return {
        valid: false,
        error: "Code 93 supports alphanumeric characters only",
      };
    }

    return { valid: true };
  }

  /**
   * Validate EAN-13 data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateEAN13(data) {
    if (!this.patterns.ean13.test(data)) {
      return {
        valid: false,
        error: "EAN-13 must be 12 or 13 digits",
      };
    }

    // Validate check digit if 13 digits provided
    if (data.length === 13) {
      const checkDigit = this.calculateEANCheckDigit(data.substring(0, 12));
      if (parseInt(data[12]) !== checkDigit) {
        return {
          valid: false,
          error: "Invalid EAN-13 check digit",
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate EAN-8 data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateEAN8(data) {
    if (!this.patterns.ean8.test(data)) {
      return {
        valid: false,
        error: "EAN-8 must be 7 or 8 digits",
      };
    }

    // Validate check digit if 8 digits provided
    if (data.length === 8) {
      const checkDigit = this.calculateEANCheckDigit(data.substring(0, 7));
      if (parseInt(data[7]) !== checkDigit) {
        return {
          valid: false,
          error: "Invalid EAN-8 check digit",
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate UPC-A data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateUPCA(data) {
    if (!this.patterns.upca.test(data)) {
      return {
        valid: false,
        error: "UPC-A must be 11 or 12 digits",
      };
    }

    return { valid: true };
  }

  /**
   * Validate UPC-E data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateUPCE(data) {
    if (!this.patterns.upce.test(data)) {
      return {
        valid: false,
        error: "UPC-E must be 6 to 8 digits",
      };
    }

    return { valid: true };
  }

  /**
   * Validate QR Code data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateQRCode(data) {
    // QR Code supports Unicode, so we just check if it's not empty
    if (data.length === 0) {
      return {
        valid: false,
        error: "QR Code data cannot be empty",
      };
    }

    return { valid: true };
  }

  /**
   * Validate Data Matrix data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validateDataMatrix(data) {
    if (data.length === 0) {
      return {
        valid: false,
        error: "Data Matrix data cannot be empty",
      };
    }

    return { valid: true };
  }

  /**
   * Validate PDF417 data
   * @param {string} data - The data to validate
   * @returns {Object} Validation result
   */
  validatePDF417(data) {
    if (data.length === 0) {
      return {
        valid: false,
        error: "PDF417 data cannot be empty",
      };
    }

    return { valid: true };
  }

  /**
   * Calculate EAN check digit
   * @param {string} data - The data without check digit
   * @returns {number} Check digit
   */
  calculateEANCheckDigit(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const digit = parseInt(data[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    return (10 - (sum % 10)) % 10;
  }
}

module.exports = { Validator };
