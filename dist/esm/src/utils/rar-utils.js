import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { createExtractorFromFile } from "node-unrar-js";
const fsp = fs.promises;
const execFileAsync = promisify(execFile);
export async function getRarContentList(filePath) {
    try {
        // Use file-based extractor to avoid loading entire file into memory
        const extractor = await createExtractorFromFile({ filepath: filePath });
        const list = extractor.getFileList();
        const headers = Array.from(list.fileHeaders);
        return headers.map((hdr) => hdr.flags.directory ? `${hdr.name}/` : hdr.name);
    }
    catch (err) {
        console.error("Error reading RAR archive:", err);
        return [];
    }
}
export async function getRarComment(filePath) {
    try {
        // Create a file‐based extractor (no need to read into memory yourself)
        const extractor = await createExtractorFromFile({ filepath: filePath });
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
export async function extractRarEntryToTemp(rarPath, entryName, destDir) {
    // 1. Determine output directory
    const outputBase = destDir
        ? destDir
        : await fsp.mkdtemp(path.join(os.tmpdir(), "rar-extract-"));
    // 2. Create the extractor, pointing it at our output folder
    const extractor = await createExtractorFromFile({
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
    return path.join(outputBase, entryName);
}
export async function doesRarContainXml(filePath) {
    try {
        const extractor = await createExtractorFromFile({ filepath: filePath });
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
export async function doesRarContainJson(filePath) {
    try {
        const extractor = await createExtractorFromFile({ filepath: filePath });
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
export async function getXmlFilesFromRar(filePath) {
    try {
        const extractor = await createExtractorFromFile({ filepath: filePath });
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
export async function getJsonFilesFromRar(filePath) {
    try {
        const extractor = await createExtractorFromFile({ filepath: filePath });
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
export async function getRarEntryContent(rarPath, entryName) {
    try {
        // Use temporary extraction approach since node-unrar-js doesn't support direct memory extraction
        const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "rar-content-"));
        const extractor = await createExtractorFromFile({
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
        const extractedFilePath = path.join(tempDir, entryName);
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
    const archiveDir = path.dirname(archivePath);
    const archiveName = path.basename(archivePath);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return path.join(archiveDir, `${archiveName}.${uniqueSuffix}.tmp`);
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
export async function updateRarComment(archivePath, comment) {
    await ensureRarCliAvailable();
    const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "rar-comment-"));
    const commentFile = path.join(tempRoot, "archive-comment.txt");
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
export async function upsertRarEntryContent(archivePath, entryName, content) {
    await ensureRarCliAvailable();
    const existingComment = await getRarComment(archivePath);
    const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "rar-update-"));
    const extractedDir = path.join(tempRoot, "archive");
    const tempArchivePath = getTemporaryArchivePath(archivePath);
    try {
        await fsp.mkdir(extractedDir, { recursive: true });
        await extractRarArchiveToDirectory(archivePath, extractedDir);
        const normalizedEntryPath = entryName
            .split("\\")
            .join("/")
            .split("/")
            .join(path.sep);
        const targetPath = path.join(extractedDir, normalizedEntryPath);
        await fsp.mkdir(path.dirname(targetPath), { recursive: true });
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