/**
 * PDF Renderer - Renders barcodes as PDF
 */

const PDFDocument = require('pdfkit');

class PDFRenderer {
  constructor() {
    this.defaultOptions = {
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 20,
      textAlign: 'center',
      textPosition: 'bottom',
      textMargin: 2,
      background: '#ffffff',
      lineColor: '#000000',
      margin: 10,
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      pageWidth: 612,
      pageHeight: 792,
    };
  }

  /**
   * Render a barcode as PDF
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {Buffer} PDF buffer
   */
  render(data, type, options = {}) {
    try {
      // Merge options with defaults
      const renderOptions = { ...this.defaultOptions, ...options };

      // Create PDF document
      const doc = new PDFDocument({
        size: [renderOptions.pageWidth, renderOptions.pageHeight],
        margins: {
          top: renderOptions.marginTop,
          bottom: renderOptions.marginBottom,
          left: renderOptions.marginLeft,
          right: renderOptions.marginRight,
        },
      });

      // Collect PDF data
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));

      return new Promise((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        doc.on('error', reject);

        // Add barcode to PDF
        this.addBarcodeToPDF(doc, data, type, renderOptions);

        // Finalize PDF
        doc.end();
      });
    } catch (error) {
      throw new Error(`PDF rendering failed: ${error.message}`);
    }
  }

  /**
   * Add barcode to PDF document
   * @param {PDFDocument} doc - PDF document
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   */
  addBarcodeToPDF(doc, data, type, options) {
    // Set background color
    doc.rect(0, 0, options.pageWidth, options.pageHeight);
    doc.fillColor(options.background);
    doc.fill();

    // Calculate position
    const x = options.marginLeft;
    const y = options.marginTop;

    if (type === 'qrcode') {
      this.addQRCodeToPDF(doc, data, x, y, options);
    } else {
      this.addLinearBarcodeToPDF(doc, data, type, x, y, options);
    }

    // Add text if displayValue is true
    if (options.displayValue) {
      doc.fontSize(options.fontSize);
      doc.fillColor(options.lineColor);
      doc.text(data, x, y + options.height + options.textMargin, {
        align: options.textAlign,
      });
    }
  }

  /**
   * Add QR Code to PDF
   * @param {PDFDocument} doc - PDF document
   * @param {string} data - The data to encode
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} options - Render options
   */
  addQRCodeToPDF(doc, data, x, y, options) {
    // This is a simplified representation
    // In a real implementation, you would use a QR code library
    const size = 200;
    const cellSize = 10;
    const cells = size / cellSize;

    // Draw QR code pattern
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const shouldFill =
          (data.charCodeAt((row * cells + col) % data.length) + row + col) %
            2 ===
          0;

        if (shouldFill) {
          doc.rect(x + col * cellSize, y + row * cellSize, cellSize, cellSize);
          doc.fillColor(options.lineColor);
          doc.fill();
        }
      }
    }
  }

  /**
   * Add linear barcode to PDF
   * @param {PDFDocument} doc - PDF document
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} options - Render options
   */
  addLinearBarcodeToPDF(doc, data, type, x, y, options) {
    const barWidth = options.width || 2;
    let currentX = x;

    // Draw bars based on data
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const barCount = (char % 5) + 1;

      for (let j = 0; j < barCount; j++) {
        doc.rect(currentX, y, barWidth, options.height);
        doc.fillColor(options.lineColor);
        doc.fill();
        currentX += barWidth * 2;
      }
    }
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

module.exports = PDFRenderer;
