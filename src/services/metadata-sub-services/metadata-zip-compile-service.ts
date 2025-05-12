import { MetadataCompiled } from "../../interfaces/metadata-compiled";

import { getZipContentList, getZipComment } from "../../utils/zip-utils";

import { convertParsedArchiveCommentToComicbookinfo } from "./metadata-zip-compile-service-conversions";

import {
  compileComicInfoXmlDataIntoMetadata,
  compileCoMetDataIntoMetadata,
} from "./metadata-compile-service";

/**
 * Compiles the XML metadata from a ZIP archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export async function compileZipArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  // Check if the archive type is ZIP, as a safety measure
  if (archiveType === "zip") {
    // Get the list of files in the ZIP archive
    const xmlFilesInZip: string[] = await getZipContentList(
      metadata.archivePath
    );

    // Check if there are files in the ZIP archive and if XML metadata is present
    if (xmlFilesInZip.length > 0 && metadata.xmlFilePresent) {
      // Check if the archive contains ComicInfo.xml or CoMet.xml
      const comicInfoXmlFile = xmlFilesInZip.find((file: string) =>
        file.endsWith("ComicInfo.xml")
      );
      const coMetXmlFile = xmlFilesInZip.find((file: string) =>
        file.endsWith("CoMet.xml")
      );

      if (comicInfoXmlFile) {
        metadata = await compileComicInfoXmlDataIntoMetadata(
          metadata,
          comicInfoXmlFile
        );
      }

      if (coMetXmlFile) {
        metadata = await compileCoMetDataIntoMetadata(metadata, coMetXmlFile);
      }
    }
  }

  return metadata;
}

/**
 * Compiles the ZIP comment metadata from a ZIP archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export async function compileZipCommentMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;
  if (archiveType === "zip" && metadata.zipCommentPresent) {
    const zipComment = await getZipComment(metadata.archivePath);
    metadata.comicbookinfoComment = zipComment;

    // parse the zip comment data
    const parsedZipCommentData = JSON.parse(zipComment);
    metadata.comicbookinfo =
      convertParsedArchiveCommentToComicbookinfo(parsedZipCommentData);
  }

  return metadata;
}
