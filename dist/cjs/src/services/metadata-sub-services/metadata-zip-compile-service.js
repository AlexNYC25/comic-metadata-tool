"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileZipArchiveXmlMetadata = compileZipArchiveXmlMetadata;
exports.compileZipCommentMetadata = compileZipCommentMetadata;
const zip_utils_1 = require("../../utils/zip-utils");
const metadata_compile_service_conversions_1 = require("./metadata-compile-service-conversions");
const metadata_compile_service_1 = require("./metadata-compile-service");
/**
 * Finds a specific XML file in the list of files.
 * @param files - List of files in the archive.
 * @param fileName - The name of the file to find.
 * @returns {string | undefined} - The file path if found, otherwise undefined.
 */
function findXmlFile(files, fileName) {
    return files.find((file) => file.endsWith(fileName));
}
async function compileZipArchiveXmlMetadata(metadata, { parseComicInfoXml = true, parseCoMet = true, } = {}) {
    const xmlFilesInZip = await (0, zip_utils_1.getZipContentList)(metadata.archivePath);
    if (!metadata.xmlFilePresent || xmlFilesInZip.length === 0)
        return metadata;
    const comicInfoXmlFile = findXmlFile(xmlFilesInZip, "ComicInfo.xml");
    const coMetXmlFile = findXmlFile(xmlFilesInZip, "CoMet.xml");
    if (comicInfoXmlFile && parseComicInfoXml) {
        metadata = await (0, metadata_compile_service_1.compileComicInfoXmlDataIntoMetadata)(metadata, comicInfoXmlFile);
    }
    if (coMetXmlFile && parseCoMet) {
        metadata = await (0, metadata_compile_service_1.compileCoMetDataIntoMetadata)(metadata, coMetXmlFile);
    }
    return metadata;
}
/**
 * Compiles the ZIP comment metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @param options - Options for parsing different metadata formats.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
async function compileZipCommentMetadata(metadata, { parseComicBookInfo = true, }) {
    if (!metadata.zipCommentPresent || !parseComicBookInfo) {
        return metadata; // No ZIP comment to process
    }
    try {
        // Get the ZIP comment
        const zipComment = await (0, zip_utils_1.getZipComment)(metadata.archivePath);
        metadata.comicbookinfoComment = zipComment;
        // Parse the ZIP comment data
        const parsedZipCommentData = JSON.parse(zipComment);
        metadata.comicbookinfo =
            (0, metadata_compile_service_conversions_1.convertParsedArchiveCommentToComicbookinfo)(parsedZipCommentData);
    }
    catch (error) {
        console.error("Failed to parse ZIP comment:", error);
    }
    return metadata;
}
//# sourceMappingURL=metadata-zip-compile-service.js.map