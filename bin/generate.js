#!/usr/bin/env node

/**
 * CLI for Isahaq Barcode Generator
 */

const { Command } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const fs = require("fs").promises;
const path = require("path");
const BarcodeGenerator = require("../index");

const program = new Command();

program
  .name("barcode-generate")
  .description("Generate barcodes and QR codes from command line")
  .version("1.0.0");

// Barcode generation command
program
  .command("barcode")
  .description("Generate a barcode")
  .requiredOption("-d, --data <data>", "Data to encode")
  .option("-t, --type <type>", "Barcode type", "code128")
  .option("-f, --format <format>", "Output format (png, svg, html, pdf)", "png")
  .option("-o, --output <file>", "Output file path")
  .option("-w, --width <width>", "Barcode width", "2")
  .option("-h, --height <height>", "Barcode height", "100")
  .option("--no-text", "Hide text below barcode")
  .option("--foreground <color>", "Foreground color (hex)", "#000000")
  .option("--background <color>", "Background color (hex)", "#ffffff")
  .action(async (options) => {
    const spinner = ora("Generating barcode...").start();

    try {
      const renderOptions = {
        width: parseInt(options.width),
        height: parseInt(options.height),
        displayValue: options.text,
        lineColor: options.foreground,
        background: options.background,
      };

      let result;
      switch (options.format) {
        case "png":
          result = BarcodeGenerator.png(
            options.data,
            options.type,
            renderOptions
          );
          break;
        case "svg":
          result = BarcodeGenerator.svg(
            options.data,
            options.type,
            renderOptions
          );
          break;
        case "html":
          result = BarcodeGenerator.html(
            options.data,
            options.type,
            renderOptions
          );
          break;
        case "pdf":
          result = BarcodeGenerator.pdf(
            options.data,
            options.type,
            renderOptions
          );
          break;
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      if (options.output) {
        await fs.writeFile(options.output, result);
        spinner.succeed(`Barcode saved to ${options.output}`);
      } else {
        // Output to stdout (for base64 encoding)
        if (Buffer.isBuffer(result)) {
          console.log(result.toString("base64"));
        } else {
          console.log(result);
        }
      }
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// QR code generation command
program
  .command("qr")
  .description("Generate a QR code")
  .requiredOption("-d, --data <data>", "Data to encode")
  .option("-s, --size <size>", "QR code size", "300")
  .option("-f, --format <format>", "Output format (png, svg, jpg)", "png")
  .option("-o, --output <file>", "Output file path")
  .option("-m, --margin <margin>", "Margin size", "10")
  .option(
    "-e, --error-correction <level>",
    "Error correction level (L, M, Q, H)",
    "M"
  )
  .option("--foreground <color>", "Foreground color (hex)", "#000000")
  .option("--background <color>", "Background color (hex)", "#ffffff")
  .option("--logo <path>", "Logo image path")
  .option("--logo-size <size>", "Logo size percentage", "60")
  .option("--label <text>", "Label text")
  .option("--watermark <text>", "Watermark text")
  .option("--watermark-position <position>", "Watermark position", "center")
  .action(async (options) => {
    const spinner = ora("Generating QR code...").start();

    try {
      const qrOptions = {
        data: options.data,
        size: parseInt(options.size),
        margin: parseInt(options.margin),
        errorCorrectionLevel: options.errorCorrection,
        foregroundColor: hexToRgb(options.foreground),
        backgroundColor: hexToRgb(options.background),
        format: options.format,
      };

      if (options.logo) {
        qrOptions.logoPath = options.logo;
        qrOptions.logoSize = parseInt(options.logoSize);
      }

      if (options.label) {
        qrOptions.label = options.label;
      }

      if (options.watermark) {
        qrOptions.watermark = options.watermark;
        qrOptions.watermarkPosition = options.watermarkPosition;
      }

      const qrCode = BarcodeGenerator.modernQr(qrOptions);
      const result = await qrCode.generate();

      if (options.output) {
        await fs.writeFile(options.output, result);
        spinner.succeed(`QR code saved to ${options.output}`);
      } else {
        // Output to stdout (for base64 encoding)
        console.log(result.toString("base64"));
      }
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Batch generation command
program
  .command("batch")
  .description("Generate multiple barcodes from a JSON file")
  .requiredOption("-i, --input <file>", "Input JSON file")
  .option("-o, --output-dir <dir>", "Output directory", "./output")
  .action(async (options) => {
    const spinner = ora("Processing batch generation...").start();

    try {
      const inputData = JSON.parse(await fs.readFile(options.input, "utf8"));

      if (!Array.isArray(inputData)) {
        throw new Error(
          "Input file must contain an array of barcode configurations"
        );
      }

      // Create output directory if it doesn't exist
      await fs.mkdir(options.outputDir, { recursive: true });

      const results = BarcodeGenerator.batch(inputData);

      let successCount = 0;
      let errorCount = 0;

      for (const result of results) {
        if (result.success) {
          const filename = `barcode_${result.index}.${result.format}`;
          const filepath = path.join(options.outputDir, filename);
          await fs.writeFile(filepath, result.result);
          successCount++;
        } else {
          errorCount++;
          console.error(
            chalk.red(`Error in item ${result.index}: ${result.error}`)
          );
        }
      }

      spinner.succeed(
        `Batch generation completed: ${successCount} successful, ${errorCount} errors`
      );
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// List supported types command
program
  .command("types")
  .description("List supported barcode types")
  .action(() => {
    const types = BarcodeGenerator.getBarcodeTypes();
    console.log(chalk.blue("Supported barcode types:"));
    types.forEach((type) => {
      console.log(`  - ${type}`);
    });
  });

// List supported formats command
program
  .command("formats")
  .description("List supported output formats")
  .action(() => {
    const formats = BarcodeGenerator.getRenderFormats();
    console.log(chalk.blue("Supported output formats:"));
    formats.forEach((format) => {
      console.log(`  - ${format}`);
    });
  });

// Validate data command
program
  .command("validate")
  .description("Validate data for a specific barcode type")
  .requiredOption("-d, --data <data>", "Data to validate")
  .requiredOption("-t, --type <type>", "Barcode type")
  .action((options) => {
    try {
      const validation = BarcodeGenerator.validate(options.data, options.type);

      if (validation.valid) {
        console.log(chalk.green("✓ Data is valid"));
        console.log(`  Type: ${validation.type}`);
        console.log(`  Length: ${validation.length}`);
        console.log(`  Charset: ${validation.charset}`);
      } else {
        console.log(chalk.red("✗ Data is invalid"));
        console.log(`  Error: ${validation.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Validation error: ${error.message}`));
      process.exit(1);
    }
  });

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

// Parse command line arguments
program.parse();
