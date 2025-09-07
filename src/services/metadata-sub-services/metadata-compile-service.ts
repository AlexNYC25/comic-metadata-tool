import { MetadataCompiled } from "../../interfaces/metadata-compiled";

import { parseXml } from "../../utils/xml-utils";
import { getZipEntryContent } from "../../utils/zip-utils";
import { getRarEntryContent } from "../../utils/rar-utils";
import { get7zEntryContent } from "../../utils/7z-utils";

import {
  convertParsedXmlToComicInfo,
  convertParsedXmlToCoMet,
} from "./metadata-compile-service-conversions";

/**
 * Extracts raw XML content from an archive based on its type.
 * @param archiveType - The type of the archive (zip, rar, 7z).
 * @param archivePath - The path to the archive file.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The raw XML content as a string.
 * @throws {Error} - Throws an error if the archive type is unsupported.
 */
async function getEntryRawContent(
  archiveType: string,
  archivePath: string,
  entryName: string
): Promise<string> {
  switch (archiveType) {
    case "zip":
      return await getZipEntryContent(archivePath, entryName);
    case "rar":
      return await getRarEntryContent(archivePath, entryName);
    case "7z":
      return await get7zEntryContent(archivePath, entryName);
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
export async function compileComicInfoXmlDataIntoMetadata(
  metadata: MetadataCompiled,
  comicInfoXmlFile: string
): Promise<MetadataCompiled> {
  // Extract the raw XML content
  metadata.comicInfoXmlFile = await getEntryRawContent(
    metadata.archiveType,
    metadata.archivePath,
    comicInfoXmlFile
  );

  // Parse the XML data
  const parsedXmlData = parseXml(metadata.comicInfoXmlFile || "") as Record<
    string,
    unknown
  >;

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
export async function compileCoMetDataIntoMetadata(
  metadata: MetadataCompiled,
  coMetXmlFile: string
): Promise<MetadataCompiled> {
  // Extract the raw XML content
  metadata.coMetXmlFile = await getEntryRawContent(
    metadata.archiveType,
    metadata.archivePath,
    coMetXmlFile
  );

  // Parse the XML data
  const parsedXmlData = parseXml(metadata.coMetXmlFile || "") as Record<
    string,
    unknown
  >;

  // Convert the parsed XML data to a CoMet object
  metadata.coMet = convertParsedXmlToCoMet(parsedXmlData);

  return metadata;
}
