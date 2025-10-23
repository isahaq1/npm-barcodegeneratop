/**
 * Tests for BarcodeService
 */

const BarcodeService = require('../src/services/BarcodeService');

describe('BarcodeService', () => {
  let service;

  beforeEach(() => {
    service = new BarcodeService();
  });

  describe('PNG Generation', () => {
    test('should generate PNG barcode', () => {
      const result = service.png('1234567890', 'code128');
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test('should generate PNG barcode with options', () => {
      const options = {
        width: 3,
        height: 150,
        displayValue: false,
      };
      const result = service.png('1234567890', 'code128', options);
      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });

  describe('SVG Generation', () => {
    test('should generate SVG barcode', () => {
      const result = service.svg('1234567890', 'code128');
      expect(typeof result).toBe('string');
    });
  });

  describe('HTML Generation', () => {
    test('should generate HTML barcode', () => {
      const result = service.html('1234567890', 'code128');
      expect(typeof result).toBe('string');
      expect(result).toContain('<div');
    });
  });

  describe('PDF Generation', () => {
    test('should generate PDF barcode', async () => {
      const result = await service.pdf('1234567890', 'code128');
      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });

  describe('Validation', () => {
    test('should validate data', () => {
      const validation = service.validate('1234567890', 'code128');
      expect(validation.valid).toBe(true);
    });

    test('should reject invalid data', () => {
      const validation = service.validate('', 'code128');
      expect(validation.valid).toBe(false);
    });
  });

  describe('Batch Generation', () => {
    test('should generate multiple barcodes', () => {
      const items = [
        { data: '1234567890', type: 'code128', format: 'png' },
        { data: '9876543210', type: 'code39', format: 'svg' },
      ];
      const results = service.batch(items);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
    });
  });
});
