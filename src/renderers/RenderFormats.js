/**
 * Render Formats - Supported output formats
 */

class RenderFormats {
  static FORMATS = {
    PNG: "png",
    SVG: "svg",
    HTML: "html",
    PDF: "pdf",
    JPG: "jpg",
    JPEG: "jpeg",
  };

  static MIME_TYPES = {
    png: "image/png",
    svg: "image/svg+xml",
    html: "text/html",
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };

  static EXTENSIONS = {
    png: ".png",
    svg: ".svg",
    html: ".html",
    pdf: ".pdf",
    jpg: ".jpg",
    jpeg: ".jpeg",
  };

  /**
   * Get all supported formats
   * @returns {Array} Array of all formats
   */
  static getAll() {
    return Object.values(this.FORMATS);
  }

  /**
   * Check if a format is valid
   * @param {string} format - The format to check
   * @returns {boolean} True if valid
   */
  static isValid(format) {
    return Object.values(this.FORMATS).includes(format);
  }

  /**
   * Get MIME type for a format
   * @param {string} format - The format
   * @returns {string} MIME type
   */
  static getMimeType(format) {
    return this.MIME_TYPES[format] || "application/octet-stream";
  }

  /**
   * Get file extension for a format
   * @param {string} format - The format
   * @returns {string} File extension
   */
  static getExtension(format) {
    return this.EXTENSIONS[format] || "";
  }

  /**
   * Get format description
   * @param {string} format - The format
   * @returns {string} Description
   */
  static getDescription(format) {
    const descriptions = {
      png: "Portable Network Graphics - Raster image format",
      svg: "Scalable Vector Graphics - Vector image format",
      html: "HyperText Markup Language - Web page format",
      pdf: "Portable Document Format - Document format",
      jpg: "JPEG - Compressed raster image format",
      jpeg: "JPEG - Compressed raster image format",
    };

    return descriptions[format] || "Unknown format";
  }
}

module.exports = { RenderFormats };
