import path from "path";
import { getComicFileMetadata, writeComicFileMetadata as writeComicFileMetadataService, } from "./src/services/metadata-service.js";
/**
 * All in one function to read the metadata of a comic archive file, reading metadata formats supported including:
 * - ComicInfo.xml
 * - ComicBookInfo
 * - CoMet
 *
 * from comic archive files such as .cbz, .cbr, .zip, .rar, .cb7, .7z
 * @param filePath - The path to the comic file as a string
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to an object containing all possible metadata in one object
 * @throws {Error} - If the file is not a valid comic archive or if there is an error reading the metadata
 * @example
 * const metadata = await readComicFileMetadata('/path/to/Batman 001 (2016).cbz');
 * console.log(metadata);
 */
export async function readComicFileMetadata(filePath, options) {
    const properFilePath = path.resolve(filePath);
    const returnObj = await getComicFileMetadata(properFilePath, options);
    return returnObj;
}
/**
 * Writes metadata into a comic archive file. The default behavior mirrors the
 * archive's existing metadata format and falls back to ComicInfo.xml.
 * @param filePath - The path to the comic file as a string.
 * @param payload - The metadata payload for one or more supported formats.
 * @param options - Write options that control format selection.
 * @returns {Promise<MetadataWriteResult>} - A promise that resolves to the write result.
 */
export async function writeComicFileMetadata(filePath, payload, options) {
    const properFilePath = path.resolve(filePath);
    return await writeComicFileMetadataService(properFilePath, payload, options);
}
//# sourceMappingURL=index.js.map