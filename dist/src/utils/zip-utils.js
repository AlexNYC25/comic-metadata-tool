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
exports.getZipContentList = getZipContentList;
exports.getZipComment = getZipComment;
exports.doesZipContainXml = doesZipContainXml;
exports.doesZipContainJson = doesZipContainJson;
exports.getXmlFilesFromZip = getXmlFilesFromZip;
exports.getJsonFilesFromZip = getJsonFilesFromZip;
exports.extractZipEntryToTemp = extractZipEntryToTemp;
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
function getZipContentList(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileData = yield fs_1.promises.readFile(filePath);
        const zip = new adm_zip_1.default(fileData);
        const entries = zip.getEntries();
        return entries.map((entry) => entry.entryName);
    });
}
function getZipComment(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(filePath);
        const zip = new adm_zip_1.default(data);
        return zip.getZipComment(); // returns a string (may be empty)
    });
}
function doesZipContainXml(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(filePath);
        const zip = new adm_zip_1.default(data);
        const entries = zip.getEntries();
        const xmlFiles = entries.filter((entry) => entry.entryName.endsWith('.xml'));
        return xmlFiles.length > 0;
    });
}
function doesZipContainJson(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(filePath);
        const zip = new adm_zip_1.default(data);
        const entries = zip.getEntries();
        const jsonFiles = entries.filter((entry) => entry.entryName.endsWith('.json'));
        return jsonFiles.length > 0;
    });
}
function getXmlFilesFromZip(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(filePath);
        const zip = new adm_zip_1.default(data);
        const entries = zip.getEntries();
        const xmlFiles = entries.filter((entry) => entry.entryName.endsWith('.xml'));
        return xmlFiles.map((entry) => entry.entryName);
    });
}
function getJsonFilesFromZip(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(filePath);
        const zip = new adm_zip_1.default(data);
        const entries = zip.getEntries();
        const jsonFiles = entries.filter((entry) => entry.entryName.endsWith('.json'));
        return jsonFiles.map((entry) => entry.entryName);
    });
}
function extractZipEntryToTemp(zipPath, entryName, destDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Read the ZIP archive into memory
        const data = yield fs_1.promises.readFile(zipPath);
        const zip = new adm_zip_1.default(data);
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
            : yield fs_1.promises.mkdtemp(path_1.default.join(os_1.default.tmpdir(), 'zip-extract-'));
        // 4. Ensure the base directory exists (for destDir or nested entry paths)
        yield fs_1.promises.mkdir(path_1.default.dirname(path_1.default.join(outputBase, entryName)), {
            recursive: true,
        });
        // 5. Write the file data
        const outPath = path_1.default.join(outputBase, entryName);
        const fileBuffer = entry.getData();
        yield fs_1.promises.writeFile(outPath, fileBuffer);
        return outPath;
    });
}
