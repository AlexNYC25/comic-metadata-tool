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
 * Main Service function to get metadata from a comic archive.
 * @param filePath
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to the compiled metadata object.
 * @throws {Error} - Throws an error if the file does not exist or if the archive type is unsupported.
 */
export async function getComicFileMetadata(
  filePath: string
): Promise<MetadataCompiled> {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist: " + filePath);
  }

  const archiveType = getArchiveType(filePath);

  if (archiveType === "unknown") {
    throw new Error("Unsupported archive type");
  }

  switch (archiveType) {
    case "zip": {
      let compiledMetadataObjZip: MetadataCompiled = {
        archiveType: archiveType,
        archivePath: filePath,
        xmlFilePresent: await doesZipContainXml(filePath),
        zipCommentPresent: (await getZipComment(filePath)) !== "",
        comicInfoXmlFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
      };

      if (compiledMetadataObjZip.xmlFilePresent) {
        compiledMetadataObjZip = await compileZipArchiveXmlMetadata(
          compiledMetadataObjZip
        );
      }

      if (compiledMetadataObjZip.zipCommentPresent) {
        compiledMetadataObjZip = await compileZipCommentMetadata(
          compiledMetadataObjZip
        );
      }

      return Promise.resolve(compiledMetadataObjZip);
    }
    case "rar": {
      let compiledMetadataObjRar: MetadataCompiled = {
        archiveType: archiveType,
        archivePath: filePath,
        xmlFilePresent: await doesRarContainXml(filePath),
        zipCommentPresent: (await getRarComment(filePath)) !== "",
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
      };

      if (compiledMetadataObjRar.xmlFilePresent) {
        compiledMetadataObjRar = await compileRarArchiveXmlMetadata(
          compiledMetadataObjRar
        );
      }

      if (compiledMetadataObjRar.zipCommentPresent) {
        compiledMetadataObjRar = await compileRarCommentMetadata(
          compiledMetadataObjRar
        );
      }

      return Promise.resolve(compiledMetadataObjRar);
    }
    case "7z": {
      let compiledMetadataObj7z: MetadataCompiled = {
        archiveType: archiveType,
        archivePath: filePath,
        xmlFilePresent: await does7zContainXml(filePath),
        zipCommentPresent: false,
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
      };

      if (compiledMetadataObj7z.xmlFilePresent) {
        compiledMetadataObj7z = await compile7zArchiveXmlMetadata(
          compiledMetadataObj7z
        );
      }

      // 7z does not have a comment feature like ZIP or RAR

      return Promise.resolve(compiledMetadataObj7z);
    }
    default: {
      const compiledMetadataObj: MetadataCompiled = {
        archiveType: archiveType,
        archivePath: filePath,
        xmlFilePresent: false,
        zipCommentPresent: false,
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
      };

      return Promise.resolve(compiledMetadataObj);
    }
  }
}
