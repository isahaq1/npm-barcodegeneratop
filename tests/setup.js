/**
 * Jest setup file
 */

// Mock canvas for testing
jest.mock("canvas", () => ({
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      fillStyle: "",
      fillRect: jest.fn(),
      drawImage: jest.fn(),
      font: "",
      fillColor: "",
      text: jest.fn(),
      rect: jest.fn(),
      fill: jest.fn(),
    })),
    toBuffer: jest.fn(() => Buffer.from("mock-png-data")),
    toSVG: jest.fn(() => "<svg>mock</svg>"),
  })),
  loadImage: jest.fn(() =>
    Promise.resolve({
      width: 100,
      height: 100,
    })
  ),
}));

// Mock fs.promises
jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(() => Promise.resolve()),
    readFile: jest.fn(() => Promise.resolve('{"test": "data"}')),
    mkdir: jest.fn(() => Promise.resolve()),
  },
}));

// Mock JsBarcode
jest.mock("jsbarcode", () => jest.fn());

// Mock QRCode
jest.mock("qrcode", () => ({
  toDataURL: jest.fn(() =>
    Promise.resolve("data:image/png;base64,mock-qr-data")
  ),
}));

// Mock PDFDocument
jest.mock("pdfkit", () => {
  return jest.fn().mockImplementation(() => ({
    rect: jest.fn().mockReturnThis(),
    fillColor: jest.fn().mockReturnThis(),
    fill: jest.fn().mockReturnThis(),
    fontSize: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    end: jest.fn(),
  }));
});
