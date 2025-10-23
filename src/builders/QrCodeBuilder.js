/**
 * QR Code Builder - Advanced QR code generation with logo and watermark support
 */

const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;

class QrCodeBuilder {
  constructor(options = {}) {
    this.options = {
      data: '',
      size: 300,
      margin: 10,
      errorCorrectionLevel: 'M',
      foregroundColor: [0, 0, 0],
      backgroundColor: [255, 255, 255],
      logoPath: null,
      logoSize: 60, // Percentage of QR code size
      label: null,
      labelFont: null,
      labelFontSize: 16,
      watermark: null,
      watermarkPosition: 'center',
      format: 'png',
      ...options,
    };
  }

  /**
   * Create a new QR Code Builder instance
   * @param {Object} options - Initial options
   * @returns {QrCodeBuilder} Builder instance
   */
  static create(options = {}) {
    return new QrCodeBuilder(options);
  }

  /**
   * Set the data to encode
   * @param {string} data - The data to encode
   * @returns {QrCodeBuilder} Builder instance
   */
  data(data) {
    this.options.data = data;
    return this;
  }

  /**
   * Set the QR code size
   * @param {number} size - Size in pixels
   * @returns {QrCodeBuilder} Builder instance
   */
  size(size) {
    this.options.size = size;
    return this;
  }

  /**
   * Set the margin
   * @param {number} margin - Margin in pixels
   * @returns {QrCodeBuilder} Builder instance
   */
  margin(margin) {
    this.options.margin = margin;
    return this;
  }

  /**
   * Set the error correction level
   * @param {string} level - Error correction level (L, M, Q, H)
   * @returns {QrCodeBuilder} Builder instance
   */
  errorCorrectionLevel(level) {
    this.options.errorCorrectionLevel = level;
    return this;
  }

  /**
   * Set the foreground color
   * @param {Array} color - RGB color array [r, g, b]
   * @returns {QrCodeBuilder} Builder instance
   */
  foregroundColor(color) {
    this.options.foregroundColor = color;
    return this;
  }

  /**
   * Set the background color
   * @param {Array} color - RGB color array [r, g, b]
   * @returns {QrCodeBuilder} Builder instance
   */
  backgroundColor(color) {
    this.options.backgroundColor = color;
    return this;
  }

  /**
   * Set the logo path
   * @param {string} logoPath - Path to logo image
   * @returns {QrCodeBuilder} Builder instance
   */
  logoPath(logoPath) {
    this.options.logoPath = logoPath;
    return this;
  }

  /**
   * Set the logo size
   * @param {number} logoSize - Logo size as percentage of QR code size
   * @returns {QrCodeBuilder} Builder instance
   */
  logoSize(logoSize) {
    this.options.logoSize = logoSize;
    return this;
  }

  /**
   * Set the label text
   * @param {string} label - Label text
   * @returns {QrCodeBuilder} Builder instance
   */
  label(label) {
    this.options.label = label;
    return this;
  }

  /**
   * Set the label font
   * @param {string} fontPath - Path to font file
   * @param {number} fontSize - Font size
   * @returns {QrCodeBuilder} Builder instance
   */
  labelFont(fontPath, fontSize = 16) {
    this.options.labelFont = fontPath;
    this.options.labelFontSize = fontSize;
    return this;
  }

  /**
   * Set the watermark
   * @param {string} watermark - Watermark text or image path
   * @param {string} position - Watermark position
   * @returns {QrCodeBuilder} Builder instance
   */
  watermark(watermark, position = 'center') {
    this.options.watermark = watermark;
    this.options.watermarkPosition = position;
    return this;
  }

  /**
   * Set the output format
   * @param {string} format - Output format (png, svg, jpg)
   * @returns {QrCodeBuilder} Builder instance
   */
  format(format) {
    this.options.format = format;
    return this;
  }

  /**
   * Build the QR code
   * @returns {Object} QR code result
   */
  build() {
    return new QrCodeResult(this.options);
  }

  /**
   * Generate QR code and return as buffer
   * @returns {Promise<Buffer>} QR code buffer
   */
  async generate() {
    const result = this.build();
    return await result.generate();
  }

  /**
   * Generate QR code and save to file
   * @param {string} filePath - Output file path
   * @returns {Promise<void>}
   */
  async saveToFile(filePath) {
    const result = this.build();
    return await result.saveToFile(filePath);
  }

  /**
   * Generate QR code and return as data URI
   * @returns {Promise<string>} Data URI
   */
  async getDataUri() {
    const result = this.build();
    return await result.getDataUri();
  }
}

/**
 * QR Code Result - Handles QR code generation and output
 */
class QrCodeResult {
  constructor(options) {
    this.options = options;
  }

  /**
   * Generate the QR code
   * @returns {Promise<Buffer>} QR code buffer
   */
  async generate() {
    try {
      // Create canvas
      const canvas = createCanvas(this.options.size, this.options.size);
      const ctx = canvas.getContext('2d');

      // Set background
      ctx.fillStyle = this.rgbToHex(this.options.backgroundColor);
      ctx.fillRect(0, 0, this.options.size, this.options.size);

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(this.options.data, {
        width: this.options.size - this.options.margin * 2,
        margin: 0,
        color: {
          dark: this.rgbToHex(this.options.foregroundColor),
          light: this.rgbToHex(this.options.backgroundColor),
        },
        errorCorrectionLevel: this.options.errorCorrectionLevel,
      });

      // Load QR code image
      const qrCodeImage = await loadImage(qrCodeDataURL);
      ctx.drawImage(qrCodeImage, this.options.margin, this.options.margin);

      // Add logo if specified
      if (this.options.logoPath) {
        await this.addLogo(ctx);
      }

      // Add watermark if specified
      if (this.options.watermark) {
        await this.addWatermark(ctx);
      }

      // Add label if specified
      if (this.options.label) {
        this.addLabel(ctx);
      }

      // Convert to buffer
      return canvas.toBuffer(`image/${this.options.format}`);
    } catch (error) {
      throw new Error(`QR code generation failed: ${error.message}`);
    }
  }

  /**
   * Add logo to QR code
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  async addLogo(ctx) {
    try {
      const logoImage = await loadImage(this.options.logoPath);
      const logoSize = (this.options.size * this.options.logoSize) / 100;
      const logoX = (this.options.size - logoSize) / 2;
      const logoY = (this.options.size - logoSize) / 2;

      // Draw white background for logo
      ctx.fillStyle = this.rgbToHex(this.options.backgroundColor);
      ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

      // Draw logo
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
    } catch (error) {
      console.warn(`Failed to add logo: ${error.message}`);
    }
  }

  /**
   * Add watermark to QR code
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  async addWatermark(ctx) {
    try {
      // Check if watermark is an image path
      if (
        this.options.watermark.includes('.') &&
        this.options.watermark.includes('/')
      ) {
        const watermarkImage = await loadImage(this.options.watermark);
        const watermarkSize = this.options.size / 4;
        const position = this.getWatermarkPosition(watermarkSize);

        ctx.drawImage(
          watermarkImage,
          position.x,
          position.y,
          watermarkSize,
          watermarkSize
        );
      } else {
        // Text watermark
        ctx.font = `${this.options.labelFontSize}px Arial`;
        ctx.fillStyle = this.rgbToHex(this.options.foregroundColor);
        ctx.textAlign = 'center';

        const position = this.getWatermarkPosition(0);
        ctx.fillText(this.options.watermark, position.x, position.y);
      }
    } catch (error) {
      console.warn(`Failed to add watermark: ${error.message}`);
    }
  }

  /**
   * Add label to QR code
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  addLabel(ctx) {
    ctx.font = `${this.options.labelFontSize}px Arial`;
    ctx.fillStyle = this.rgbToHex(this.options.foregroundColor);
    ctx.textAlign = 'center';

    const labelY = this.options.size - 10;
    ctx.fillText(this.options.label, this.options.size / 2, labelY);
  }

  /**
   * Get watermark position
   * @param {number} size - Watermark size
   * @returns {Object} Position coordinates
   */
  getWatermarkPosition(size) {
    const positions = {
      'top-left': { x: 10, y: 10 },
      'top-right': { x: this.options.size - size - 10, y: 10 },
      'bottom-left': { x: 10, y: this.options.size - size - 10 },
      'bottom-right': {
        x: this.options.size - size - 10,
        y: this.options.size - size - 10,
      },
      center: {
        x: (this.options.size - size) / 2,
        y: (this.options.size - size) / 2,
      },
      'top-center': { x: (this.options.size - size) / 2, y: 10 },
      'bottom-center': {
        x: (this.options.size - size) / 2,
        y: this.options.size - size - 10,
      },
      'left-center': { x: 10, y: (this.options.size - size) / 2 },
      'right-center': {
        x: this.options.size - size - 10,
        y: (this.options.size - size) / 2,
      },
    };

    return positions[this.options.watermarkPosition] || positions.center;
  }

  /**
   * Convert RGB array to hex color
   * @param {Array} rgb - RGB color array
   * @returns {string} Hex color
   */
  rgbToHex(rgb) {
    return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  }

  /**
   * Save QR code to file
   * @param {string} filePath - Output file path
   * @returns {Promise<void>}
   */
  async saveToFile(filePath) {
    const buffer = await this.generate();
    await fs.writeFile(filePath, buffer);
  }

  /**
   * Get QR code as data URI
   * @returns {Promise<string>} Data URI
   */
  async getDataUri() {
    const buffer = await this.generate();
    const base64 = buffer.toString('base64');
    return `data:image/${this.options.format};base64,${base64}`;
  }

  /**
   * Get QR code as string
   * @returns {Promise<string>} QR code string
   */
  async getString() {
    return await this.generate();
  }
}

module.exports = QrCodeBuilder;
