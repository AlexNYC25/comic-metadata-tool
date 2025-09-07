// zip-utils.ts
import fs from "fs";
import os from "os";
import path from "path";
import Seven from "node-7z";
import sevenBin from "7zip-bin";

const fsp = fs.promises;

export async function get7zContentList(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const files: string[] = [];
    // point at the 7za binary from 7zip-bin
    const stream = Seven.list(filePath, { $bin: sevenBin.path7za });

    stream.on("data", (entry) => {
      if (entry.file) {
        files.push(entry.file);
      }
    });

    stream.on("end", () => resolve(files));
    stream.on("error", (err: Error) => reject(err));
  });
}

export async function extract7zEntryToTemp(
  archivePath: string,
  entryName: string,
  destDir?: string
): Promise<string> {
  // 1. Choose output base
  const outputBase = destDir
    ? destDir
    : await fsp.mkdtemp(path.join(os.tmpdir(), "7z-extract-"));

  // 2. Kick off a full‑path extract but cherry‑pick only our file
  const extractStream = Seven.extractFull(archivePath, outputBase, {
    $bin: sevenBin.path7za,
    $cherryPick: [entryName],
  }); // :contentReference[oaicite:0]{index=0}

  // 3. Collect events and resolve when done
  return new Promise((resolve, reject) => {
    const seen: Set<string> = new Set();

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
      resolve(path.join(outputBase, entryName));
    });

    extractStream.on("error", (err) => {
      reject(err);
    });
  });
}

export async function does7zContainXml(filePath: string): Promise<boolean> {
  const files = await get7zContentList(filePath);
  return files.some((file) => file.endsWith(".xml"));
}

export async function does7zContainJson(filePath: string): Promise<boolean> {
  const files = await get7zContentList(filePath);
  return files.some((file) => file.endsWith(".json"));
}

export async function getXmlFilesFrom7z(filePath: string): Promise<string[]> {
  const files = await get7zContentList(filePath);
  return files.filter((file) => file.endsWith(".xml"));
}

export async function getJsonFilesFrom7z(filePath: string): Promise<string[]> {
  const files = await get7zContentList(filePath);
  return files.filter((file) => file.endsWith(".json"));
}

/**
 * Directly extracts the content of a 7z entry as a string without creating temporary files.
 * @param archivePath - The path to the 7z archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export async function get7zEntryContent(
  archivePath: string,
  entryName: string
): Promise<string> {
  // Extract to temporary location first, then read and clean up
  const tempPath = await extract7zEntryToTemp(archivePath, entryName);

  try {
    const content = await fsp.readFile(tempPath, "utf-8");
    return content;
  } finally {
    // Clean up temporary file
    try {
      await fsp.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
