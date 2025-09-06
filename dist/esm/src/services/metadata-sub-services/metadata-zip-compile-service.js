import { getZipContentList, getZipComment } from "../../utils/zip-utils.js";
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
export async function compileZipArchiveXmlMetadata(metadata, { parseComicInfoXml = true, parseCoMet = true, } = {}) {
    const xmlFilesInZip = await getZipContentList(metadata.archivePath);
    if (!metadata.xmlFilePresent || xmlFilesInZip.length === 0)
        return metadata;
    const comicInfoXmlFile = findXmlFile(xmlFilesInZip, "ComicInfo.xml");
    const coMetXmlFile = findXmlFile(xmlFilesInZip, "CoMet.xml");
    if (comicInfoXmlFile && parseComicInfoXml) {
        metadata = await compileComicInfoXmlDataIntoMetadata(metadata, comicInfoXmlFile);
    }
    if (coMetXmlFile && parseCoMet) {
        metadata = await compileCoMetDataIntoMetadata(metadata, coMetXmlFile);
    }
    return metadata;
}
/**
 * Compiles the ZIP comment metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @param options - Options for parsing different metadata formats.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export async function compileZipCommentMetadata(metadata, { parseComicBookInfo = true, }) {
    if (!metadata.zipCommentPresent || !parseComicBookInfo) {
        return metadata; // No ZIP comment to process
    }
    try {
        // Get the ZIP comment
        const zipComment = await getZipComment(metadata.archivePath);
        metadata.comicbookinfoComment = zipComment;
        // Parse the ZIP comment data
        const parsedZipCommentData = JSON.parse(zipComment);
        metadata.comicbookinfo =
            convertParsedArchiveCommentToComicbookinfo(parsedZipCommentData);
    }
    catch (error) {
        console.error("Failed to parse ZIP comment:", error);
    }
    return metadata;
}
//# sourceMappingURL=metadata-zip-compile-service.js.map