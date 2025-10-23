/**
 * Basic usage examples for Isahaq Barcode Generator
 */

const BarcodeGenerator = require('@isahaq/barcode');

async function basicExamples() {
  console.log('🚀 Basic Barcode Generation Examples\n');

  // 1. Generate PNG barcode
  console.log('1. Generating PNG barcode...');
  const pngBuffer = BarcodeGenerator.png('1234567890', 'code128');
  console.log(`   PNG buffer size: ${pngBuffer.length} bytes`);

  // 2. Generate SVG barcode
  console.log('2. Generating SVG barcode...');
  const svgString = BarcodeGenerator.svg('1234567890', 'ean13');
  console.log(`   SVG length: ${svgString.length} characters`);

  // 3. Generate HTML barcode
  console.log('3. Generating HTML barcode...');
  const htmlString = BarcodeGenerator.html('1234567890', 'code39');
  console.log(`   HTML length: ${htmlString.length} characters`);

  // 4. Generate PDF barcode
  console.log('4. Generating PDF barcode...');
  const pdfBuffer = await BarcodeGenerator.pdf('1234567890', 'code128');
  console.log(`   PDF buffer size: ${pdfBuffer.length} bytes`);

  // 5. Generate QR code
  console.log('5. Generating QR code...');
  const qrCode = BarcodeGenerator.modernQr({
    data: 'https://example.com',
    size: 300,
    margin: 10,
  });
  const qrBuffer = await qrCode.generate();
  console.log(`   QR code buffer size: ${qrBuffer.length} bytes`);

  // 6. Generate QR code with logo
  console.log('6. Generating QR code with logo...');
  const qrWithLogo = BarcodeGenerator.modernQr({
    data: 'https://example.com',
    size: 300,
    logoPath: 'path/to/logo.png',
    logoSize: 60,
    label: 'Scan me!',
  });
  const qrWithLogoBuffer = await qrWithLogo.generate();
  console.log(
    `   QR code with logo buffer size: ${qrWithLogoBuffer.length} bytes`
  );

  console.log('\n✅ All examples completed successfully!');
}

// Run examples
basicExamples().catch(console.error);
