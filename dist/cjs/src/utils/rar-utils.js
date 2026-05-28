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
exports.getRarEntryContent = getRarEntryContent;
exports.updateRarComment = updateRarComment;
exports.upsertRarEntryContent = upsertRarEntryContent;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const node_unrar_js_1 = require("node-unrar-js");
const fsp = fs_1.default.promises;
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
async function getRarContentList(filePath) {
    try {
        // Use file-based extractor to avoid loading entire file into memory
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
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
    try {
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
        return xmlFiles.length > 0;
    }
    catch (err) {
        console.error("Error checking RAR for XML files:", err);
        return false;
    }
}
async function doesRarContainJson(filePath) {
    try {
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
        return jsonFiles.length > 0;
    }
    catch (err) {
        console.error("Error checking RAR for JSON files:", err);
        return false;
    }
}
async function getXmlFilesFromRar(filePath) {
    try {
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
        return xmlFiles.map((header) => header.name);
    }
    catch (err) {
        console.error("Error getting XML files from RAR:", err);
        return [];
    }
}
async function getJsonFilesFromRar(filePath) {
    try {
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({ filepath: filePath });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
        return jsonFiles.map((header) => header.name);
    }
    catch (err) {
        console.error("Error getting JSON files from RAR:", err);
        return [];
    }
}
/**
 * Directly extracts the content of a RAR entry as a string without creating temporary files.
 * @param rarPath - The path to the RAR archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
async function getRarEntryContent(rarPath, entryName) {
    try {
        // Use temporary extraction approach since node-unrar-js doesn't support direct memory extraction
        const tempDir = await fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "rar-content-"));
        const extractor = await (0, node_unrar_js_1.createExtractorFromFile)({
            filepath: rarPath,
            targetPath: tempDir,
        });
        // Extract the specific file
        const { files: extractedFiles } = extractor.extract({ files: [entryName] });
        const results = Array.from(extractedFiles);
        const fileRecord = results.find((r) => r.fileHeader.name === entryName);
        if (!fileRecord) {
            throw new Error(`Entry "${entryName}" not found in archive.`);
        }
        if (fileRecord.fileHeader.flags.directory) {
            throw new Error(`Entry "${entryName}" is a directory, not a file.`);
        }
        // Read the extracted file content
        const extractedFilePath = path_1.default.join(tempDir, entryName);
        const content = await fsp.readFile(extractedFilePath, "utf-8");
        // Clean up temporary directory
        await fsp.rm(tempDir, { recursive: true, force: true });
        return content;
    }
    catch (err) {
        console.error("Error extracting RAR entry content:", err);
        throw err;
    }
}
function getTemporaryArchivePath(archivePath) {
    const archiveDir = path_1.default.dirname(archivePath);
    const archiveName = path_1.default.basename(archivePath);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return path_1.default.join(archiveDir, `${archiveName}.${uniqueSuffix}.tmp`);
}
async function ensureRarCliAvailable() {
    try {
        await execFileAsync("rar", ["-iver"]);
        await execFileAsync("unrar", ["-iver"]);
    }
    catch {
        throw new Error('RAR write support requires both "rar" and "unrar" command-line tools.');
    }
}
async function extractRarArchiveToDirectory(archivePath, outputDir) {
    await execFileAsync("unrar", ["x", "-o+", "-inul", archivePath, outputDir]);
}
async function createRarArchiveFromDirectory(sourceDir, outputArchivePath) {
    await execFileAsync("rar", ["a", "-y", "-r", "-ep1", "-idq", "-inul", outputArchivePath, "."], { cwd: sourceDir });
}
async function updateRarComment(archivePath, comment) {
    await ensureRarCliAvailable();
    const tempRoot = await fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "rar-comment-"));
    const commentFile = path_1.default.join(tempRoot, "archive-comment.txt");
    try {
        await fsp.writeFile(commentFile, comment, "utf-8");
        await execFileAsync("rar", [
            "c",
            "-y",
            "-idq",
            `-z${commentFile}`,
            archivePath,
        ]);
    }
    finally {
        await fsp.rm(tempRoot, { recursive: true, force: true });
    }
}
async function upsertRarEntryContent(archivePath, entryName, content) {
    await ensureRarCliAvailable();
    const existingComment = await getRarComment(archivePath);
    const tempRoot = await fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "rar-update-"));
    const extractedDir = path_1.default.join(tempRoot, "archive");
    const tempArchivePath = getTemporaryArchivePath(archivePath);
    try {
        await fsp.mkdir(extractedDir, { recursive: true });
        await extractRarArchiveToDirectory(archivePath, extractedDir);
        const normalizedEntryPath = entryName
            .split("\\")
            .join("/")
            .split("/")
            .join(path_1.default.sep);
        const targetPath = path_1.default.join(extractedDir, normalizedEntryPath);
        await fsp.mkdir(path_1.default.dirname(targetPath), { recursive: true });
        await fsp.writeFile(targetPath, content, "utf-8");
        await createRarArchiveFromDirectory(extractedDir, tempArchivePath);
        if (existingComment.trim().length > 0) {
            await updateRarComment(tempArchivePath, existingComment);
        }
        await fsp.rename(tempArchivePath, archivePath);
    }
    finally {
        await fsp.rm(tempRoot, { recursive: true, force: true });
        await fsp.rm(tempArchivePath, { force: true });
    }
}
//# sourceMappingURL=rar-utils.js.map