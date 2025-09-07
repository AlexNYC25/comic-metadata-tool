"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZipContentList = getZipContentList;
exports.getZipComment = getZipComment;
exports.doesZipContainXml = doesZipContainXml;
exports.doesZipContainJson = doesZipContainJson;
exports.getXmlFilesFromZip = getXmlFilesFromZip;
exports.getJsonFilesFromZip = getJsonFilesFromZip;
exports.extractZipEntryToTemp = extractZipEntryToTemp;
exports.getZipEntryContent = getZipEntryContent;
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
async function getZipContentList(filePath) {
    // Use file-based constructor to avoid loading entire file into memory
    const zip = new adm_zip_1.default(filePath);
    const entries = zip.getEntries();
    return entries.map((entry) => entry.entryName);
}
async function getZipComment(filePath) {
    // Use file-based constructor to avoid loading entire file into memory
    const zip = new adm_zip_1.default(filePath);
    return zip.getZipComment(); // returns a string (may be empty)
}
async function doesZipContainXml(filePath) {
    const zip = new adm_zip_1.default(filePath);
    const entries = zip.getEntries();
    const xmlFiles = entries.filter((entry) => entry.entryName.endsWith(".xml"));
    return xmlFiles.length > 0;
}
async function doesZipContainJson(filePath) {
    const zip = new adm_zip_1.default(filePath);
    const entries = zip.getEntries();
    const jsonFiles = entries.filter((entry) => entry.entryName.endsWith(".json"));
    return jsonFiles.length > 0;
}
async function getXmlFilesFromZip(filePath) {
    const zip = new adm_zip_1.default(filePath);
    const entries = zip.getEntries();
    const xmlFiles = entries.filter((entry) => entry.entryName.endsWith(".xml"));
    return xmlFiles.map((entry) => entry.entryName);
}
async function getJsonFilesFromZip(filePath) {
    const zip = new adm_zip_1.default(filePath);
    const entries = zip.getEntries();
    const jsonFiles = entries.filter((entry) => entry.entryName.endsWith(".json"));
    return jsonFiles.map((entry) => entry.entryName);
}
async function extractZipEntryToTemp(zipPath, entryName, destDir) {
    // 1. Use file-based constructor to avoid loading entire archive into memory
    const zip = new adm_zip_1.default(zipPath);
    // 2. Locate the requested entry
    const entry = zip.getEntry(entryName);
    if (!entry) {
        throw new Error(`Entry "${entryName}" not found in archive.`);
    }
    if (entry.isDirectory) {
        throw new Error(`Entry "${entryName}" is a directory, not a file.`);
    }
    // 3. Determine output directory
    const outputBase = destDir
        ? destDir
        : await fs_1.promises.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "zip-extract-"));
    // 4. Ensure the base directory exists (for destDir or nested entry paths)
    await fs_1.promises.mkdir(path_1.default.dirname(path_1.default.join(outputBase, entryName)), {
        recursive: true,
    });
    // 5. Extract only the specific file data (not entire archive)
    const outPath = path_1.default.join(outputBase, entryName);
    const fileBuffer = entry.getData();
    await fs_1.promises.writeFile(outPath, fileBuffer);
    return outPath;
}
/**
 * Directly extracts the content of a ZIP entry as a string without creating temporary files.
 * @param zipPath - The path to the ZIP archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
async function getZipEntryContent(zipPath, entryName) {
    const zip = new adm_zip_1.default(zipPath);
    const entry = zip.getEntry(entryName);
    if (!entry) {
        throw new Error(`Entry "${entryName}" not found in archive.`);
    }
    if (entry.isDirectory) {
        throw new Error(`Entry "${entryName}" is a directory, not a file.`);
    }
    // Get file content directly as string
    return entry.getData().toString("utf-8");
}
//# sourceMappingURL=zip-utils.js.map