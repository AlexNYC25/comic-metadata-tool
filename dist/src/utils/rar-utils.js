"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function getRarContentList(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileBuffer = fs_1.default.readFileSync(filePath);
        const arrayBuffer = Uint8Array.from(fileBuffer).buffer;
        try {
            const extractor = yield (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
            const list = extractor.getFileList();
            const headers = Array.from(list.fileHeaders);
            return headers.map((hdr) => hdr.flags.directory ? `${hdr.name}/` : hdr.name);
        }
        catch (err) {
            console.error("Error reading RAR archive:", err);
            return [];
        }
    });
}
function getRarComment(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a file‐based extractor (no need to read into memory yourself)
            const extractor = yield (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
            // Get the archive header + file list
            const { arcHeader } = extractor.getFileList();
            // arcHeader.comment is a string (may be empty) :contentReference[oaicite:0]{index=0}
            return arcHeader.comment || "";
        }
        catch (err) {
            console.error("Error reading RAR comment:", err);
            return "";
        }
    });
}
function extractRarEntryToTemp(rarPath, entryName, destDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Determine output directory
        const outputBase = destDir
            ? destDir
            : yield fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "rar-extract-"));
        // 2. Create the extractor, pointing it at our output folder
        const extractor = yield (0, node_unrar_js_1.createExtractorFromFile)({
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
    });
}
function doesRarContainXml(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = fs_1.default.readFileSync(filePath);
        const arrayBuffer = Uint8Array.from(data).buffer;
        const extractor = yield (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
        return xmlFiles.length > 0;
    });
}
function doesRarContainJson(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = fs_1.default.readFileSync(filePath);
        const arrayBuffer = Uint8Array.from(data).buffer;
        const extractor = yield (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
        return jsonFiles.length > 0;
    });
}
function getXmlFilesFromRar(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = fs_1.default.readFileSync(filePath);
        const arrayBuffer = Uint8Array.from(data).buffer;
        const extractor = yield (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
        const xmlFileNames = xmlFiles.map((header) => header.name);
        return xmlFileNames;
    });
}
function getJsonFilesFromRar(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = fs_1.default.readFileSync(filePath);
        const arrayBuffer = Uint8Array.from(data).buffer;
        const extractor = yield (0, node_unrar_js_1.createExtractorFromData)({ data: arrayBuffer });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
        const jsonFileNames = jsonFiles.map((header) => header.name);
        return jsonFileNames;
    });
}
