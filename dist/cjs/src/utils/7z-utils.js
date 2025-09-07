"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get7zContentList = get7zContentList;
exports.extract7zEntryToTemp = extract7zEntryToTemp;
exports.does7zContainXml = does7zContainXml;
exports.does7zContainJson = does7zContainJson;
exports.getXmlFilesFrom7z = getXmlFilesFrom7z;
exports.getJsonFilesFrom7z = getJsonFilesFrom7z;
exports.get7zEntryContent = get7zEntryContent;
// zip-utils.ts
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const node_7z_1 = __importDefault(require("node-7z"));
const _7zip_bin_1 = __importDefault(require("7zip-bin"));
const fsp = fs_1.default.promises;
async function get7zContentList(filePath) {
    return new Promise((resolve, reject) => {
        const files = [];
        // point at the 7za binary from 7zip-bin
        const stream = node_7z_1.default.list(filePath, { $bin: _7zip_bin_1.default.path7za });
        stream.on("data", (entry) => {
            if (entry.file) {
                files.push(entry.file);
            }
        });
        stream.on("end", () => resolve(files));
        stream.on("error", (err) => reject(err));
    });
}
async function extract7zEntryToTemp(archivePath, entryName, destDir) {
    // 1. Choose output base
    const outputBase = destDir
        ? destDir
        : await fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "7z-extract-"));
    // 2. Kick off a full‑path extract but cherry‑pick only our file
    const extractStream = node_7z_1.default.extractFull(archivePath, outputBase, {
        $bin: _7zip_bin_1.default.path7za,
        $cherryPick: [entryName],
    }); // :contentReference[oaicite:0]{index=0}
    // 3. Collect events and resolve when done
    return new Promise((resolve, reject) => {
        const seen = new Set();
        extractStream.on("data", (data) => {
            if (data.file) {
                seen.add(data.file);
            }
        });
        extractStream.on("end", () => {
            // Did we get our target?
            if (!seen.has(entryName)) {
                return reject(new Error(`Entry "${entryName}" not found in archive.`));
            }
            // Return the path where it was placed
            resolve(path_1.default.join(outputBase, entryName));
        });
        extractStream.on("error", (err) => {
            reject(err);
        });
    });
}
async function does7zContainXml(filePath) {
    const files = await get7zContentList(filePath);
    return files.some((file) => file.endsWith(".xml"));
}
async function does7zContainJson(filePath) {
    const files = await get7zContentList(filePath);
    return files.some((file) => file.endsWith(".json"));
}
async function getXmlFilesFrom7z(filePath) {
    const files = await get7zContentList(filePath);
    return files.filter((file) => file.endsWith(".xml"));
}
async function getJsonFilesFrom7z(filePath) {
    const files = await get7zContentList(filePath);
    return files.filter((file) => file.endsWith(".json"));
}
/**
 * Directly extracts the content of a 7z entry as a string without creating temporary files.
 * @param archivePath - The path to the 7z archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
async function get7zEntryContent(archivePath, entryName) {
    // Extract to temporary location first, then read and clean up
    const tempPath = await extract7zEntryToTemp(archivePath, entryName);
    try {
        const content = await fsp.readFile(tempPath, "utf-8");
        return content;
    }
    finally {
        // Clean up temporary file
        try {
            await fsp.unlink(tempPath);
        }
        catch {
            // Ignore cleanup errors
        }
    }
}
//# sourceMappingURL=7z-utils.js.map