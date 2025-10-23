/**
 * Tests for BarcodeGenerator
 */

const BarcodeGenerator = require("../index");

describe("BarcodeGenerator", () => {
  describe("PNG Generation", () => {
    test("should generate PNG barcode", () => {
      const result = BarcodeGenerator.png("1234567890", "code128");
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("should generate PNG barcode with options", () => {
      const options = {
        width: 3,
        height: 150,
        displayValue: false,
      };
      const result = BarcodeGenerator.png("1234567890", "code128", options);
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("should throw error for invalid data", () => {
      expect(() => {
        BarcodeGenerator.png("", "code128");
      }).toThrow("Data must be a non-empty string");
    });

    test("should throw error for invalid barcode type", () => {
      expect(() => {
        BarcodeGenerator.png("1234567890", "invalid-type");
      }).toThrow("Invalid barcode type");
    });
  });

  describe("SVG Generation", () => {
    test("should generate SVG barcode", () => {
      const result = BarcodeGenerator.svg("1234567890", "code128");
      expect(typeof result).toBe("string");
      expect(result).toContain("<svg");
    });

    test("should generate SVG barcode with options", () => {
      const options = {
        width: 3,
        height: 150,
        displayValue: false,
      };
      const result = BarcodeGenerator.svg("1234567890", "code128", options);
      expect(typeof result).toBe("string");
    });
  });

  describe("HTML Generation", () => {
    test("should generate HTML barcode", () => {
      const result = BarcodeGenerator.html("1234567890", "code128");
      expect(typeof result).toBe("string");
      expect(result).toContain("<div");
    });

    test("should generate HTML barcode with options", () => {
      const options = {
        width: 3,
        height: 150,
        displayValue: false,
      };
      const result = BarcodeGenerator.html("1234567890", "code128", options);
      expect(typeof result).toBe("string");
    });
  });

  describe("PDF Generation", () => {
    test("should generate PDF barcode", async () => {
      const result = await BarcodeGenerator.pdf("1234567890", "code128");
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("should generate PDF barcode with options", async () => {
      const options = {
        width: 3,
        height: 150,
        displayValue: false,
      };
      const result = await BarcodeGenerator.pdf(
        "1234567890",
        "code128",
        options
      );
      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });

  describe("QR Code Generation", () => {
    test("should generate QR code", () => {
      const result = BarcodeGenerator.modernQr({
        data: "https://example.com",
        size: 300,
      });
      expect(result).toBeDefined();
      expect(typeof result.generate).toBe("function");
    });

    test("should generate QR code with logo", () => {
      const result = BarcodeGenerator.modernQr({
        data: "https://example.com",
        size: 300,
        logoPath: "path/to/logo.png",
        logoSize: 60,
      });
      expect(result).toBeDefined();
    });

    test("should generate QR code with watermark", () => {
      const result = BarcodeGenerator.modernQr({
        data: "https://example.com",
        size: 300,
        watermark: "Watermark Text",
        watermarkPosition: "center",
      });
      expect(result).toBeDefined();
    });
  });

  describe("Validation", () => {
    test("should validate data for Code 128", () => {
      const validation = BarcodeGenerator.validate("1234567890", "code128");
      expect(validation.valid).toBe(true);
    });

    test("should validate data for EAN-13", () => {
      const validation = BarcodeGenerator.validate("1234567890123", "ean13");
      expect(validation.valid).toBe(true);
    });

    test("should reject invalid data for EAN-13", () => {
      const validation = BarcodeGenerator.validate("123", "ean13");
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain("too short");
    });
  });

  describe("Batch Generation", () => {
    test("should generate multiple barcodes", () => {
      const items = [
        { data: "1234567890", type: "code128", format: "png" },
        { data: "9876543210", type: "code39", format: "svg" },
      ];
      const results = BarcodeGenerator.batch(items);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
    });

    test("should handle batch generation errors", () => {
      const items = [
        { data: "1234567890", type: "code128", format: "png" },
        { data: "", type: "code128", format: "png" }, // Invalid data
      ];
      const results = BarcodeGenerator.batch(items);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
    });
  });

  describe("Utility Methods", () => {
    test("should get barcode types", () => {
      const types = BarcodeGenerator.getBarcodeTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types).toContain("code128");
      expect(types).toContain("ean13");
    });

    test("should get render formats", () => {
      const formats = BarcodeGenerator.getRenderFormats();
      expect(Array.isArray(formats)).toBe(true);
      expect(formats).toContain("png");
      expect(formats).toContain("svg");
    });

    test("should get watermark positions", () => {
      const positions = BarcodeGenerator.getWatermarkPositions();
      expect(Array.isArray(positions)).toBe(true);
      expect(positions).toContain("center");
      expect(positions).toContain("top-left");
    });
  });
});
