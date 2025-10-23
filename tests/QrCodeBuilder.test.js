/**
 * Tests for QrCodeBuilder
 */

const QrCodeBuilder = require("../src/builders/QrCodeBuilder");

describe("QrCodeBuilder", () => {
  describe("Builder Pattern", () => {
    test("should create builder instance", () => {
      const builder = QrCodeBuilder.create();
      expect(builder).toBeDefined();
      expect(typeof builder.data).toBe("function");
      expect(typeof builder.size).toBe("function");
      expect(typeof builder.build).toBe("function");
    });

    test("should chain methods", () => {
      const builder = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .margin(10)
        .foregroundColor([0, 0, 0])
        .backgroundColor([255, 255, 255])
        .build();

      expect(builder).toBeDefined();
    });
  });

  describe("QR Code Generation", () => {
    test("should generate QR code", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .build();

      const result = await qrCode.generate();
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("should generate QR code with logo", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .logoPath("path/to/logo.png")
        .logoSize(60)
        .build();

      const result = await qrCode.generate();
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("should generate QR code with watermark", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .watermark("Watermark Text", "center")
        .build();

      const result = await qrCode.generate();
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("should generate QR code with label", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .label("Scan me!")
        .build();

      const result = await qrCode.generate();
      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });

  describe("Output Methods", () => {
    test("should save to file", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .build();

      await expect(qrCode.saveToFile("test-qr.png")).resolves.not.toThrow();
    });

    test("should get data URI", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .build();

      const dataUri = await qrCode.getDataUri();
      expect(typeof dataUri).toBe("string");
      expect(dataUri).toContain("data:image/");
    });

    test("should get string", async () => {
      const qrCode = QrCodeBuilder.create()
        .data("https://example.com")
        .size(300)
        .build();

      const result = await qrCode.getString();
      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });

  describe("Options", () => {
    test("should set all options", () => {
      const builder = QrCodeBuilder.create({
        data: "https://example.com",
        size: 300,
        margin: 10,
        errorCorrectionLevel: "H",
        foregroundColor: [0, 0, 0],
        backgroundColor: [255, 255, 255],
        logoPath: "path/to/logo.png",
        logoSize: 60,
        label: "Scan me!",
        watermark: "Watermark",
        watermarkPosition: "center",
        format: "png",
      });

      expect(builder.options.data).toBe("https://example.com");
      expect(builder.options.size).toBe(300);
      expect(builder.options.margin).toBe(10);
    });
  });
});
