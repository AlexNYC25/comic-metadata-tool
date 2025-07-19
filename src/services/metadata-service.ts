import fs from "fs";

import { MetadataCompiled } from "../interfaces/metadata-compiled";

import { getArchiveType } from "../utils/file-utils";
import { getZipComment, doesZipContainXml } from "../utils/zip-utils";
import { getRarComment, doesRarContainXml } from "../utils/rar-utils";
import { does7zContainXml } from "../utils/7z-utils";

import {
  compileZipArchiveXmlMetadata,
  compileZipCommentMetadata,
} from "./metadata-sub-services/metadata-zip-compile-service";

import {
  compileRarArchiveXmlMetadata,
  compileRarCommentMetadata,
} from "./metadata-sub-services/metadata-rar-compile-service";

import { compile7zArchiveXmlMetadata } from "./metadata-sub-services/metadata-7z-compile-service";

/**
 * Processes metadata for a given archive type, compiling XML and comment metadata as needed with the provided functions.
 * @param metadata - The metadata object to process.
 * @param options - Options for parsing different metadata formats.
 * @param compileXmlMetadata - Function to compile XML metadata.
 * @param compileCommentMetadata - Optional function to compile comment metadata.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
async function processMetadata(
  metadata: MetadataCompiled,
  options: {
    parseComicInfoXml?: boolean;
    parseComicBookInfo?: boolean;
    parseCoMet?: boolean;
  },
  compileXmlMetadata: (
    metadata: MetadataCompiled,
    options: {
      parseComicInfoXml?: boolean;
      parseComicBookInfo?: boolean;
      parseCoMet?: boolean;
    }
  ) => Promise<MetadataCompiled>,
  compileCommentMetadata?: (
    metadata: MetadataCompiled,
    options: {
      parseComicInfoXml?: boolean;
      parseComicBookInfo?: boolean;
      parseCoMet?: boolean;
    }
  ) => Promise<MetadataCompiled>
): Promise<MetadataCompiled> {
  if (metadata.xmlFilePresent) {
    metadata = await compileXmlMetadata(metadata, options);
  }

  if (metadata.zipCommentPresent && compileCommentMetadata) {
    metadata = await compileCommentMetadata(metadata, options);
  }

  return metadata;
}

/**
 * Service to read and compile metadata from the comic archive file for both XML and comment formats.
 * @param filePath - The path to the comic archive file.
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to the compiled metadata object.
 * @throws {Error} - Throws an error if the archive type is unsupported or if the file does not exist.
 */
export async function getComicFileMetadata(
  filePath: string,
  options?: {
    parseComicInfoXml?: boolean;
    parseComicBookInfo?: boolean;
    parseCoMet?: boolean;
  }
): Promise<MetadataCompiled> {
  // Ensure the file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  // Determine the archive type
  const archiveType = getArchiveType(filePath);
  const supportedArchiveTypes = new Set(["zip", "rar", "7z"]);

  if (!supportedArchiveTypes.has(archiveType)) {
    throw new Error("Unsupported archive type");
  }

  // Initialize the metadata object
  const metadata: MetadataCompiled = {
    archiveType,
    archivePath: filePath,
    xmlFilePresent: false,
    zipCommentPresent: false,
    comicInfoXmlFile: "",
    coMetXmlFile: "",
    comicbookinfoComment: "",
  };

  // Process metadata based on archive type
  switch (archiveType) {
    case "zip":
      metadata.xmlFilePresent = await doesZipContainXml(filePath);
      metadata.zipCommentPresent = (await getZipComment(filePath)) !== "";
      return processMetadata(
        metadata,
        options || {},
        compileZipArchiveXmlMetadata,
        compileZipCommentMetadata
      );

    case "rar":
      metadata.xmlFilePresent = await doesRarContainXml(filePath);
      metadata.zipCommentPresent = (await getRarComment(filePath)) !== "";
      return processMetadata(
        metadata,
        options || {},
        compileRarArchiveXmlMetadata,
        compileRarCommentMetadata
      );
    case "7z":
      metadata.xmlFilePresent = await does7zContainXml(filePath);
      return processMetadata(
        metadata,
        options || {},
        compile7zArchiveXmlMetadata
      );

    default:
      throw new Error("Unexpected archive type");
  }
}
