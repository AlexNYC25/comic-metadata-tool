import { get7zContentList } from "../../utils/7z-utils.js";
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
 * Compiles metadata from a 7z archive by processing ComicInfo.xml and CoMet.xml files.
 * @param metadata - The metadata object to update.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
export async function compile7zArchiveXmlMetadata(metadata, { parseComicInfoXml = true, parseCoMet = true, }) {
    // Get the list of XML files in the 7z archive
    const xmlFilesIn7z = await get7zContentList(metadata.archivePath);
    if (xmlFilesIn7z.length === 0) {
        return metadata; // No XML files to process
    }
    // Find specific XML files
    const comicInfoXmlFile = findXmlFile(xmlFilesIn7z, "ComicInfo.xml");
    const coMetXmlFile = findXmlFile(xmlFilesIn7z, "CoMet.xml");
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
//# sourceMappingURL=metadata-7z-compile-service.js.map