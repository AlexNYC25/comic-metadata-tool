"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileComicInfoXmlDataIntoMetadata = compileComicInfoXmlDataIntoMetadata;
exports.compileCoMetDataIntoMetadata = compileCoMetDataIntoMetadata;
const xml_utils_1 = require("../../utils/xml-utils");
const zip_utils_1 = require("../../utils/zip-utils");
const rar_utils_1 = require("../../utils/rar-utils");
const _7z_utils_1 = require("../../utils/7z-utils");
const metadata_compile_service_conversions_1 = require("./metadata-compile-service-conversions");
/**
 * Extracts raw XML content from an archive based on its type.
 * @param archiveType - The type of the archive (zip, rar, 7z).
 * @param archivePath - The path to the archive file.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The raw XML content as a string.
 * @throws {Error} - Throws an error if the archive type is unsupported.
 */
async function getEntryRawContent(archiveType, archivePath, entryName) {
    switch (archiveType) {
        case "zip":
            return await (0, zip_utils_1.getZipEntryContent)(archivePath, entryName);
        case "rar":
            return await (0, rar_utils_1.getRarEntryContent)(archivePath, entryName);
        case "7z":
            return await (0, _7z_utils_1.get7zEntryContent)(archivePath, entryName);
        default:
            throw new Error(`Unsupported archive type: ${archiveType}`);
    }
}
/**
 * Converts the raw ComicInfo XML data to a ComicInfo object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param comicInfoXmlFile - The name of the ComicInfo XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
async function compileComicInfoXmlDataIntoMetadata(metadata, comicInfoXmlFile) {
    // Extract the raw XML content
    metadata.comicInfoXmlFile = await getEntryRawContent(metadata.archiveType, metadata.archivePath, comicInfoXmlFile);
    // Parse the XML data
    const parsedXmlData = (0, xml_utils_1.parseXml)(metadata.comicInfoXmlFile || "");
    // Convert the parsed XML data to a ComicInfo object
    metadata.comicInfoXml = (0, metadata_compile_service_conversions_1.convertParsedXmlToComicInfo)(parsedXmlData);
    return metadata;
}
/**
 * Converts the raw CoMet XML data to a CoMet object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param coMetXmlFile - The name of the CoMet XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
async function compileCoMetDataIntoMetadata(metadata, coMetXmlFile) {
    // Extract the raw XML content
    metadata.coMetXmlFile = await getEntryRawContent(metadata.archiveType, metadata.archivePath, coMetXmlFile);
    // Parse the XML data
    const parsedXmlData = (0, xml_utils_1.parseXml)(metadata.coMetXmlFile || "");
    // Convert the parsed XML data to a CoMet object
    metadata.coMet = (0, metadata_compile_service_conversions_1.convertParsedXmlToCoMet)(parsedXmlData);
    return metadata;
}
//# sourceMappingURL=metadata-compile-service.js.map