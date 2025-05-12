import fs from "fs";
import { MetadataCompiled } from "../../interfaces/metadata-compiled";

import { parseXml } from "../../utils/xml-utils";
import { extractZipEntryToTemp } from "../../utils/zip-utils";
import { extractRarEntryToTemp } from "../../utils/rar-utils";
import { extract7zEntryToTemp } from "../../utils/7z-utils";

import {
  convertParsedXmlToComicInfo,
  convertParsedXmlToCoMet,
} from "./metadata-zip-compile-service-conversions";

/**
 * Converts the raw ComicInfo XML data to a ComicInfo object.
 * @param metadata
 * @param comicInfoXmlFile
 * @returns Promise<MetadataCompiled>
 */
export async function compileComicInfoXmlDataIntoMetadata(
  metadata: MetadataCompiled,
  comicInfoXmlFile: string
): Promise<MetadataCompiled> {
  if (metadata.archiveType == "zip") {
    // Extract the XML file from the ZIP archive to the raw XML variable
    metadata.comicInfoXmlFile = await getZipEntryRawContent(
      metadata.archivePath,
      comicInfoXmlFile
    );
  } else if (metadata.archiveType == "rar") {
    // Extract the XML file from the RAR archive to the raw XML variable
    metadata.comicInfoXmlFile = await getRarEntryRawContent(
      metadata.archivePath,
      comicInfoXmlFile
    );
  } else if (metadata.archiveType == "7z") {
    // Extract the XML file from the 7z archive to the raw XML variable
    metadata.comicInfoXmlFile = await get7zEntryRawContent(
      metadata.archivePath,
      comicInfoXmlFile
    );
  }

  // parse the xml data and assert its shape for conversion
  const parsedXmlData = parseXml(metadata.comicInfoXmlFile || "") as Record<
    string,
    unknown
  >;

  // Convert the parsed XML data to a ComicInfo object and set it in the metadata
  metadata.comicInfoXml = convertParsedXmlToComicInfo(parsedXmlData);

  return metadata;
}

/**
 * Converts the raw ComicInfo XML data to a ComicInfo object.
 * @param metadata
 * @param coMetXmlFile
 * @returns Promise<MetadataCompiled>
 */
export async function compileCoMetDataIntoMetadata(
  metadata: MetadataCompiled,
  coMetXmlFile: string
): Promise<MetadataCompiled> {
  if (metadata.archiveType == "zip") {
    // Extract the XML file from the ZIP archive to the raw XML variable
    metadata.coMetXmlFile = await getZipEntryRawContent(
      metadata.archivePath,
      coMetXmlFile
    );
  } else if (metadata.archiveType == "rar") {
    // Extract the XML file from the RAR archive to the raw XML variable
    metadata.coMetXmlFile = await getRarEntryRawContent(
      metadata.archivePath,
      coMetXmlFile
    );
  } else if (metadata.archiveType == "7z") {
    metadata.coMetXmlFile = await get7zEntryRawContent(
      metadata.archivePath,
      coMetXmlFile
    );
  }

  // parse the xml data and assert its shape for conversion
  const parsedXmlData = parseXml(metadata.coMetXmlFile || "") as Record<
    string,
    unknown
  >;

  // Convert the parsed XML data to a ComicInfo object and set it in the metadata
  metadata.coMet = convertParsedXmlToCoMet(parsedXmlData);

  return metadata;
}

/**
 * Extracts the XML content from a ZIP archive, specifically a passed entry in the archive.
 * @param archivePath
 * @param zipEntryName
 * @returns {Promise<string>} - The raw XML content as a string.
 */
export async function getZipEntryRawContent(
  archivePath: string,
  zipEntryName: string
): Promise<string> {
  // Extract the XML file from the ZIP archive to a temporary location
  const tempExtractPathOfXml = await extractZipEntryToTemp(
    archivePath,
    zipEntryName
  );

  // Read the extracted XML file
  const xmlDataRaw = await fs.promises.readFile(tempExtractPathOfXml, "utf-8");

  // Clean up the temporary file
  await fs.promises.unlink(tempExtractPathOfXml);

  // Return the raw XML data as a string
  return xmlDataRaw;
}

/**
 *
 */
export async function getRarEntryRawContent(
  archivePath: string,
  rarEntryName: string
): Promise<string> {
  // Extract the XML file from the RAR archive to a temporary location
  const tempExtractPathOfXml = await extractRarEntryToTemp(
    archivePath,
    rarEntryName
  );

  // Read the extracted XML file
  const xmlDataRaw = await fs.promises.readFile(tempExtractPathOfXml, "utf-8");

  // Clean up the temporary file
  await fs.promises.unlink(tempExtractPathOfXml);

  // Return the raw XML data as a string
  return xmlDataRaw;
}

async function get7zEntryRawContent(
  archivePath: string,
  zipEntryName: string
): Promise<string> {
  // Extract the XML file from the ZIP archive to a temporary location
  const tempExtractPathOfXml = await extract7zEntryToTemp(
    archivePath,
    zipEntryName
  );

  // Read the extracted XML file
  const xmlDataRaw = await fs.promises.readFile(tempExtractPathOfXml, "utf-8");

  // Clean up the temporary file
  await fs.promises.unlink(tempExtractPathOfXml);

  // Return the raw XML data as a string
  return xmlDataRaw;
}
