/**
 * HTML Renderer - Renders barcodes as HTML
 */

class HTMLRenderer {
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
      className: 'barcode',
      id: null,
    };
  }

  /**
   * Render a barcode as HTML
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {string} HTML string
   */
  render(data, type, options = {}) {
    try {
      // Merge options with defaults
      const renderOptions = { ...this.defaultOptions, ...options };

      // Generate HTML structure
      const html = this.createHTMLStructure(data, type, renderOptions);
      return html;
    } catch (error) {
      throw new Error(`HTML rendering failed: ${error.message}`);
    }
  }

  /**
   * Create HTML structure for barcode
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {string} HTML string
   */
  createHTMLStructure(data, type, options) {
    const containerId =
      options.id ||
      `barcode-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const containerClass = options.className || 'barcode';

    let html = `<div id="${containerId}" class="${containerClass}" style="${this.getContainerStyles(
      options
    )}">`;

    // Add barcode representation
    if (type === 'qrcode') {
      html += this.createQRCodeHTML(data, options);
    } else {
      html += this.createLinearBarcodeHTML(data, type, options);
    }

    // Add text if displayValue is true
    if (options.displayValue) {
      html += `<div class="barcode-text" style="${this.getTextStyles(
        options
      )}">${data}</div>`;
    }

    html += '</div>';

    // Add CSS styles
    html += this.getCSSStyles(containerId, options);

    return html;
  }

  /**
   * Create QR Code HTML representation
   * @param {string} data - The data to encode
   * @param {Object} options - Render options
   * @returns {string} HTML content
   */
  createQRCodeHTML(data, options) {
    // This is a simplified representation
    // In a real implementation, you would use a QR code library
    const size = 200;
    const cellSize = 10;
    const cells = size / cellSize;

    let html = `<div class="qr-code" style="width: ${size}px; height: ${size}px; display: grid; grid-template-columns: repeat(${cells}, 1fr); gap: 1px; background: ${options.background}; padding: 10px;">`;

    // Generate a simple pattern based on data
    for (let i = 0; i < cells * cells; i++) {
      const shouldFill = (data.charCodeAt(i % data.length) + i) % 2 === 0;
      const color = shouldFill ? options.lineColor : options.background;
      html += `<div style="background-color: ${color}; width: 100%; height: 100%;"></div>`;
    }

    html += '</div>';
    return html;
  }

  /**
   * Create linear barcode HTML representation
   * @param {string} data - The data to encode
   * @param {string} type - The barcode type
   * @param {Object} options - Render options
   * @returns {string} HTML content
   */
  createLinearBarcodeHTML(data, type, options) {
    const barWidth = options.width || 2;
    const barHeight = options.height || 100;

    let html = `<div class="linear-barcode" style="display: flex; align-items: flex-start; background: ${options.background}; padding: 10px;">`;

    // Generate bars based on data
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const barCount = (char % 5) + 1;

      for (let j = 0; j < barCount; j++) {
        html += `<div style="width: ${barWidth}px; height: ${barHeight}px; background-color: ${options.lineColor}; margin-right: ${barWidth}px;"></div>`;
      }
    }

    html += '</div>';
    return html;
  }

  /**
   * Get container styles
   * @param {Object} options - Render options
   * @returns {string} CSS styles
   */
  getContainerStyles(options) {
    return `
      display: inline-block;
      background: ${options.background};
      padding: ${options.margin}px;
      margin: ${options.marginTop}px ${options.marginRight}px ${options.marginBottom}px ${options.marginLeft}px;
      border: 1px solid #ccc;
      text-align: center;
    `;
  }

  /**
   * Get text styles
   * @param {Object} options - Render options
   * @returns {string} CSS styles
   */
  getTextStyles(options) {
    return `
      font-family: Arial, sans-serif;
      font-size: ${options.fontSize}px;
      color: ${options.lineColor};
      text-align: ${options.textAlign};
      margin-top: ${options.textMargin}px;
    `;
  }

  /**
   * Get CSS styles for the barcode
   * @param {string} containerId - Container ID
   * @param {Object} options - Render options
   * @returns {string} CSS styles
   */
  getCSSStyles(containerId) {
    return `
      <style>
        #${containerId} {
          font-family: Arial, sans-serif;
        }
        #${containerId} .barcode-text {
          font-weight: bold;
        }
        #${containerId} .qr-code {
          margin: 0 auto;
        }
        #${containerId} .linear-barcode {
          justify-content: center;
        }
      </style>
    `;
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

module.exports = HTMLRenderer;
