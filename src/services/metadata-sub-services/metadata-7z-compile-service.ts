import { MetadataCompiled } from "../../interfaces/metadata-compiled";

import { get7zContentList } from "../../utils/7z-utils";

import {
  compileComicInfoXmlDataIntoMetadata,
  compileCoMetDataIntoMetadata,
} from "./metadata-compile-service";

export async function compile7zArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "7z") {
    const xmlFilesIn7z: string[] = await get7zContentList(metadata.archivePath);

    if (xmlFilesIn7z.length > 0) {
      const comicInfoXmlFile = xmlFilesIn7z.find((file: string) =>
        file.endsWith("ComicInfo.xml")
      );
      const coMetXmlFile = xmlFilesIn7z.find((file: string) =>
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
