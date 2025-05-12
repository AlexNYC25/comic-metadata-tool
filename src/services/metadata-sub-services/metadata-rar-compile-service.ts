import { MetadataCompiled } from "../../interfaces/metadata-compiled";

import { getRarContentList, getRarComment } from "../../utils/rar-utils";

import { convertParsedArchiveCommentToComicbookinfo } from "./metadata-zip-compile-service-conversions";

import {
  compileComicInfoXmlDataIntoMetadata,
  compileCoMetDataIntoMetadata,
} from "./metadata-compile-service";

/**
 * Compiles the XML metadata from a RAR archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export async function compileRarArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "rar") {
    const xmlFilesInRar: string[] = await getRarContentList(
      metadata.archivePath
    );

    if (xmlFilesInRar.length > 0 && metadata.xmlFilePresent) {
      const comicInfoXmlFile = xmlFilesInRar.find((file: string) =>
        file.endsWith("ComicInfo.xml")
      );
      const coMetXmlFile = xmlFilesInRar.find((file: string) =>
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
 * Compiles the ZIP comment metadata from a RAR archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export async function compileRarCommentMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;
  if (archiveType === "rar" && metadata.zipCommentPresent) {
    const rarComment = await getRarComment(metadata.archivePath);
    metadata.comicbookinfoComment = rarComment;

    // parse the rar comment data
    const parsedRarCommentData = JSON.parse(rarComment);
    metadata.comicbookinfo =
      convertParsedArchiveCommentToComicbookinfo(parsedRarCommentData);
  }

  return metadata;
}
