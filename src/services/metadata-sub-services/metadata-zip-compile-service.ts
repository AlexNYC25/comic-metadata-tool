import { MetadataCompiled } from "../../interfaces/metadata-compiled";

import { getZipContentList, getZipComment } from "../../utils/zip-utils";

import { convertParsedArchiveCommentToComicbookinfo } from "./metadata-compile-service-conversions";

import {
  compileComicInfoXmlDataIntoMetadata,
  compileCoMetDataIntoMetadata,
} from "./metadata-compile-service";

/**
 * Finds a specific XML file in the list of files.
 * @param files - List of files in the archive.
 * @param fileName - The name of the file to find.
 * @returns {string | undefined} - The file path if found, otherwise undefined.
 */
function findXmlFile(files: string[], fileName: string): string | undefined {
  return files.find((file) => file.endsWith(fileName));
}

/**
 * Compiles the XML metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export async function compileZipArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  // Get the list of files in the ZIP archive
  const xmlFilesInZip: string[] = await getZipContentList(metadata.archivePath);

  if (xmlFilesInZip.length === 0 || !metadata.xmlFilePresent) {
    return metadata; // No XML files to process
  }

  // Find specific XML files
  const comicInfoXmlFile = findXmlFile(xmlFilesInZip, "ComicInfo.xml");
  const coMetXmlFile = findXmlFile(xmlFilesInZip, "CoMet.xml");

  // Compile metadata from ComicInfo.xml if it exists
  if (comicInfoXmlFile) {
    metadata = await compileComicInfoXmlDataIntoMetadata(
      metadata,
      comicInfoXmlFile
    );
  }

  // Compile metadata from CoMet.xml if it exists
  if (coMetXmlFile) {
    metadata = await compileCoMetDataIntoMetadata(metadata, coMetXmlFile);
  }

  return metadata;
}

/**
 * Compiles the ZIP comment metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export async function compileZipCommentMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  if (!metadata.zipCommentPresent) {
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
  } catch (error) {
    console.error("Failed to parse ZIP comment:", error);
  }

  return metadata;
}
