import fs from "fs";
import { parseXml } from "../../utils/xml-utils.js";
import { extractZipEntryToTemp } from "../../utils/zip-utils.js";
import { extractRarEntryToTemp } from "../../utils/rar-utils.js";
import { extract7zEntryToTemp } from "../../utils/7z-utils.js";
import { convertParsedXmlToComicInfo, convertParsedXmlToCoMet, } from "./metadata-compile-service-conversions.js";
/**
 * Extracts raw XML content from an archive based on its type.
 * @param archiveType - The type of the archive (zip, rar, 7z).
 * @param archivePath - The path to the archive file.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The raw XML content as a string.
 * @throws {Error} - Throws an error if the archive type is unsupported.
 */
async function getEntryRawContent(archiveType, archivePath, entryName) {
    let tempExtractPathOfXml;
    switch (archiveType) {
        case "zip":
            tempExtractPathOfXml = await extractZipEntryToTemp(archivePath, entryName);
            break;
        case "rar":
            tempExtractPathOfXml = await extractRarEntryToTemp(archivePath, entryName);
            break;
        case "7z":
            tempExtractPathOfXml = await extract7zEntryToTemp(archivePath, entryName);
            break;
        default:
            throw new Error(`Unsupported archive type: ${archiveType}`);
    }
    // Read the extracted XML file
    const xmlDataRaw = await fs.promises.readFile(tempExtractPathOfXml, "utf-8");
    // Clean up the temporary file
    await fs.promises.unlink(tempExtractPathOfXml);
    return xmlDataRaw;
}
/**
 * Converts the raw ComicInfo XML data to a ComicInfo object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param comicInfoXmlFile - The name of the ComicInfo XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
export async function compileComicInfoXmlDataIntoMetadata(metadata, comicInfoXmlFile) {
    // Extract the raw XML content
    metadata.comicInfoXmlFile = await getEntryRawContent(metadata.archiveType, metadata.archivePath, comicInfoXmlFile);
    // Parse the XML data
    const parsedXmlData = parseXml(metadata.comicInfoXmlFile || "");
    // Convert the parsed XML data to a ComicInfo object
    metadata.comicInfoXml = convertParsedXmlToComicInfo(parsedXmlData);
    return metadata;
}
/**
 * Converts the raw CoMet XML data to a CoMet object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param coMetXmlFile - The name of the CoMet XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
export async function compileCoMetDataIntoMetadata(metadata, coMetXmlFile) {
    // Extract the raw XML content
    metadata.coMetXmlFile = await getEntryRawContent(metadata.archiveType, metadata.archivePath, coMetXmlFile);
    // Parse the XML data
    const parsedXmlData = parseXml(metadata.coMetXmlFile || "");
    // Convert the parsed XML data to a CoMet object
    metadata.coMet = convertParsedXmlToCoMet(parsedXmlData);
    return metadata;
}
//# sourceMappingURL=metadata-compile-service.js.map