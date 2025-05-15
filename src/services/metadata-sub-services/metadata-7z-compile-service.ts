import { MetadataCompiled } from "../../interfaces/metadata-compiled";
import { get7zContentList } from "../../utils/7z-utils";
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
 * Compiles metadata from a 7z archive by processing ComicInfo.xml and CoMet.xml files.
 * @param metadata - The metadata object to update.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
export async function compile7zArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  // Get the list of XML files in the 7z archive
  const xmlFilesIn7z: string[] = await get7zContentList(metadata.archivePath);

  if (xmlFilesIn7z.length === 0) {
    return metadata; // No XML files to process
  }

  // Find specific XML files
  const comicInfoXmlFile = findXmlFile(xmlFilesIn7z, "ComicInfo.xml");
  const coMetXmlFile = findXmlFile(xmlFilesIn7z, "CoMet.xml");

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
