import { getRarContentList, getRarComment } from "../../utils/rar-utils.js";
import { convertParsedArchiveCommentToComicbookinfo } from "./metadata-compile-service-conversions.js";
import { compileComicInfoXmlDataIntoMetadata, compileCoMetDataIntoMetadata, } from "./metadata-compile-service.js";
/**
 * Finds a specific XML file in the list of files.
 * @param files - List of files in the archive.
 * @param fileName - The name of the file to find.
 * @returns {string | undefined} - The file path if found, otherwise undefined.
 */
function findXmlFile(files, fileName) {
    return files.find((file) => file.endsWith(fileName));
}
/**
 * Compiles the XML metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export async function compileRarArchiveXmlMetadata(metadata, { parseComicInfoXml = true, parseCoMet = true, }) {
    // Get the list of XML files in the RAR archive
    const xmlFilesInRar = await getRarContentList(metadata.archivePath);
    if (xmlFilesInRar.length === 0 || !metadata.xmlFilePresent) {
        return metadata; // No XML files to process
    }
    // Find specific XML files
    const comicInfoXmlFile = findXmlFile(xmlFilesInRar, "ComicInfo.xml");
    const coMetXmlFile = findXmlFile(xmlFilesInRar, "CoMet.xml");
    // Compile metadata from ComicInfo.xml if it exists
    if (comicInfoXmlFile && parseComicInfoXml) {
        metadata = await compileComicInfoXmlDataIntoMetadata(metadata, comicInfoXmlFile);
    }
    // Compile metadata from CoMet.xml if it exists
    if (coMetXmlFile && parseCoMet) {
        metadata = await compileCoMetDataIntoMetadata(metadata, coMetXmlFile);
    }
    return metadata;
}
/**
 * Compiles the ZIP comment metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export async function compileRarCommentMetadata(metadata, { parseComicBookInfo = true, }) {
    if (!metadata.zipCommentPresent || !parseComicBookInfo) {
        return metadata; // No ZIP comment to process
    }
    try {
        // Get the RAR comment
        const rarComment = await getRarComment(metadata.archivePath);
        metadata.comicbookinfoComment = rarComment;
        // Parse the RAR comment data
        const parsedRarCommentData = JSON.parse(rarComment);
        metadata.comicbookinfo =
            convertParsedArchiveCommentToComicbookinfo(parsedRarCommentData);
    }
    catch (error) {
        // We can log the error but we don't want to throw it, we just want to return the metadata without the comment data/ atttepting to parse it
        console.error("Failed to parse RAR comment:", error);
    }
    return metadata;
}
//# sourceMappingURL=metadata-rar-compile-service.js.map