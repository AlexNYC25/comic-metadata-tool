"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRarContentList = getRarContentList;
exports.getRarComment = getRarComment;
exports.extractRarEntryToTemp = extractRarEntryToTemp;
exports.doesRarContainXml = doesRarContainXml;
exports.doesRarContainJson = doesRarContainJson;
exports.getXmlFilesFromRar = getXmlFilesFromRar;
exports.getJsonFilesFromRar = getJsonFilesFromRar;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const node_unrar_js_1 = require("node-unrar-js");
const fsp = fs_1.default.promises;
async function getRarContentList(filePath) {
    const fileBuffer = fs_1.default.readFileSync(filePath);
    const arrayBuffer = Uint8Array.from(fileBuffer).buffer;
    try {
        const extractor = await (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        return headers.map((hdr) => hdr.flags.directory ? `${hdr.name}/` : hdr.name);
    }
    catch (err) {
        console.error("Error reading RAR archive:", err);
        return [];
    }
}
async function getRarComment(filePath) {
    try {
        // Create a file‐based extractor (no need to read into memory yourself)
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
        // Get the archive header + file list
        const { arcHeader } = extractor.getFileList();
        // arcHeader.comment is a string (may be empty) :contentReference[oaicite:0]{index=0}
        return arcHeader.comment || "";
    }
    catch (err) {
        console.error("Error reading RAR comment:", err);
        return "";
    }
}
async function extractRarEntryToTemp(rarPath, entryName, destDir) {
    // 1. Determine output directory
    const outputBase = destDir
        ? destDir
        : await fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "rar-extract-"));
    // 2. Create the extractor, pointing it at our output folder
    const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({
        filepath: rarPath,
        targetPath: outputBase,
    });
    // 3. Extract just the one file
    const { files: extractedFiles } = extractor.extract({ files: [entryName] });
    // 4. Realize the generator and find our file
    const results = Array.from(extractedFiles);
    const fileRecord = results.find((r) => r.fileHeader.name === entryName);
    if (!fileRecord) {
        throw new Error(`Entry "${entryName}" not found in archive.`);
    }
    if (fileRecord.fileHeader.flags.directory) {
        throw new Error(`Entry "${entryName}" is a directory, not a file.`);
    }
    // 5. Return the path where it was written
    return path_1.default.join(outputBase, entryName);
}
async function doesRarContainXml(filePath) {
    const data = fs_1.default.readFileSync(filePath);
    const arrayBuffer = Uint8Array.from(data).buffer;
    const extractor = await (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);
    const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
    return xmlFiles.length > 0;
}
async function doesRarContainJson(filePath) {
    const data = fs_1.default.readFileSync(filePath);
    const arrayBuffer = Uint8Array.from(data).buffer;
    const extractor = await (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);
    const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
    return jsonFiles.length > 0;
}
async function getXmlFilesFromRar(filePath) {
    const data = fs_1.default.readFileSync(filePath);
    const arrayBuffer = Uint8Array.from(data).buffer;
    const extractor = await (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);
    const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
    const xmlFileNames = xmlFiles.map((header) => header.name);
    return xmlFileNames;
}
async function getJsonFilesFromRar(filePath) {
    const data = fs_1.default.readFileSync(filePath);
    const arrayBuffer = Uint8Array.from(data).buffer;
    const extractor = await (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);
    const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
    const jsonFileNames = jsonFiles.map((header) => header.name);
    return jsonFileNames;
}
//# sourceMappingURL=rar-utils.js.map