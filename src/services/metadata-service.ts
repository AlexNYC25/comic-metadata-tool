import fs from "fs";

import { getArchiveType } from "../utils/file-utils";

import {
  getZipContentList,
  getZipComment,
  extractZipEntryToTemp,
  doesZipContainXml,
  doesZipContainJson,
} from "../utils/zip-utils";
import {
  getRarContentList,
  getRarComment,
  extractRarEntryToTemp,
  doesRarContainXml,
  doesRarContainJson,
} from "../utils/rar-utils";
import {
  get7zContentList,
  extract7zEntryToTemp,
  does7zContainJson,
  does7zContainXml,
} from "../utils/7z-utils";

import { parseXml } from "../utils/xml-utils";

import { MetadataCompiled } from "../interfaces/metadata-compiled";

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
        jsonFilePresent: await doesZipContainJson(filePath),
        zipCommentPresent: (await getZipComment(filePath)) !== "",
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
        comicInfoXml: null,
        comicInfoJson: null,
        coMet: null,
        comicbookinfo: null,
      };

      if (compiledMetadataObjZip.xmlFilePresent) {
        compiledMetadataObjZip = await compileZipArchiveXmlMetadata(
          compiledMetadataObjZip
        );
      }

      if (compiledMetadataObjZip.jsonFilePresent) {
        compiledMetadataObjZip = await compileZipArchiveJsonMetadata(
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
        jsonFilePresent: await doesRarContainJson(filePath),
        zipCommentPresent: (await getRarComment(filePath)) !== "",
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
        comicInfoXml: null,
        comicInfoJson: null,
        coMet: null,
        comicbookinfo: null,
      };

      if (compiledMetadataObjRar.xmlFilePresent) {
        compiledMetadataObjRar = await compileRarArchiveXmlMetadata(
          compiledMetadataObjRar
        );
      }

      if (compiledMetadataObjRar.jsonFilePresent) {
        compiledMetadataObjRar = await compileRarArchiveJsonMetadata(
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
        jsonFilePresent: await does7zContainJson(filePath),
        zipCommentPresent: false,
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
        comicInfoXml: null,
        comicInfoJson: null,
        coMet: null,
        comicbookinfo: null,
      };

      if (compiledMetadataObj7z.xmlFilePresent) {
        compiledMetadataObj7z = await compile7zArchiveXmlMetadata(
          compiledMetadataObj7z
        );
      }

      if (compiledMetadataObj7z.jsonFilePresent) {
        compiledMetadataObj7z = await compile7zArchiveJsonMetadata(
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
        jsonFilePresent: false,
        zipCommentPresent: false,
        comicInfoXmlFile: "",
        comicInfoJsonFile: "",
        coMetXmlFile: "",
        comicbookinfoComment: "",
        comicInfoXml: null,
        comicInfoJson: null,
        coMet: null,
        comicbookinfo: null,
      };

      return Promise.resolve(compiledMetadataObj);
    }
  }
}

/**
 * Compiles the XML metadata from a ZIP archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
async function compileZipArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "zip") {
    const xmlFilesInZip: string[] = await getZipContentList(
      metadata.archivePath
    );

    if (xmlFilesInZip.length > 0) {
      const comicInfoXmlFile = xmlFilesInZip.find((file: string) =>
        file.endsWith("ComicInfo.xml")
      );
      const coMetXmlFile = xmlFilesInZip.find((file: string) =>
        file.endsWith("CoMet.xml")
      );

      if (comicInfoXmlFile) {
        const tempExtractPathOfXml = await extractZipEntryToTemp(
          metadata.archivePath,
          comicInfoXmlFile
        );

        const xmlDataRaw = await fs.promises.readFile(
          tempExtractPathOfXml,
          "utf-8"
        );
        metadata.comicInfoXmlFile = xmlDataRaw;

        // parse the xml data
        const parsedXmlData = parseXml(xmlDataRaw);
        metadata.comicInfoXml = parsedXmlData;
      }

      if (coMetXmlFile) {
        const tempExtractPathOfXml = await extractZipEntryToTemp(
          metadata.archivePath,
          coMetXmlFile
        );

        const xmlDataRaw = await fs.promises.readFile(
          tempExtractPathOfXml,
          "utf-8"
        );
        metadata.coMetXmlFile = xmlDataRaw;

        // parse the xml data
        const parsedXmlData = parseXml(xmlDataRaw);
        metadata.coMet = parsedXmlData;
      }
    }
  }

  return metadata;
}

/**
 * Compiles the JSON metadata from a ZIP archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with JSON data.
 */
async function compileZipArchiveJsonMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "zip") {
    const jsonFilesInZip: string[] = await getZipContentList(
      metadata.archivePath
    );

    if (jsonFilesInZip.length > 0) {
      const comicInfoJsonFile = jsonFilesInZip.find((file: string) =>
        file.endsWith("ComicInfo.json")
      );

      if (comicInfoJsonFile) {
        const tempExtractPathOfJson = await extractZipEntryToTemp(
          metadata.archivePath,
          comicInfoJsonFile
        );

        const jsonDataRaw = await fs.promises.readFile(
          tempExtractPathOfJson,
          "utf-8"
        );
        metadata.comicInfoJsonFile = jsonDataRaw;

        // parse the JSON data
        const parsedJsonData = JSON.parse(jsonDataRaw);
        metadata.comicInfoJson = parsedJsonData;
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
async function compileZipCommentMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;
  if (archiveType === "zip") {
    const zipComment = await getZipComment(metadata.archivePath);
    metadata.comicbookinfoComment = zipComment;

    // parse the zip comment data
    const parsedZipCommentData = JSON.parse(zipComment);
    metadata.comicbookinfo = parsedZipCommentData;
  }

  return metadata;
}

/**
 * Compiles the XML metadata from a RAR archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
async function compileRarArchiveXmlMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "rar") {
    const xmlFilesInRar: string[] = await getRarContentList(
      metadata.archivePath
    );

    if (xmlFilesInRar.length > 0) {
      const comicInfoXmlFile = xmlFilesInRar.find((file: string) =>
        file.endsWith("ComicInfo.xml")
      );
      const coMetXmlFile = xmlFilesInRar.find((file: string) =>
        file.endsWith("CoMet.xml")
      );

      if (comicInfoXmlFile) {
        const tempExtractPathOfXml = await extractRarEntryToTemp(
          metadata.archivePath,
          comicInfoXmlFile
        );

        const xmlDataRaw = await fs.promises.readFile(
          tempExtractPathOfXml,
          "utf-8"
        );
        metadata.comicInfoXmlFile = xmlDataRaw;

        // parse the xml data
        const parsedXmlData = parseXml(xmlDataRaw);
        metadata.comicInfoXml = parsedXmlData;
      }

      if (coMetXmlFile) {
        const tempExtractPathOfXml = await extractRarEntryToTemp(
          metadata.archivePath,
          coMetXmlFile
        );

        const xmlDataRaw = await fs.promises.readFile(
          tempExtractPathOfXml,
          "utf-8"
        );
        metadata.coMetXmlFile = xmlDataRaw;

        // parse the xml data
        const parsedXmlData = parseXml(xmlDataRaw);
        metadata.coMet = parsedXmlData;
      }
    }
  }

  return metadata;
}

/**
 * Compiles the JSON metadata from a RAR archive.
 * @param {MetadataCompiled} metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with JSON data.
 */
async function compileRarArchiveJsonMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "rar") {
    const jsonFilesInRar: string[] = await getRarContentList(
      metadata.archivePath
    );

    if (jsonFilesInRar.length > 0) {
      const comicInfoJsonFile = jsonFilesInRar.find((file: string) =>
        file.endsWith("ComicInfo.json")
      );

      if (comicInfoJsonFile) {
        const tempExtractPathOfJson = await extractRarEntryToTemp(
          metadata.archivePath,
          comicInfoJsonFile
        );

        const jsonDataRaw = await fs.promises.readFile(
          tempExtractPathOfJson,
          "utf-8"
        );
        metadata.comicInfoJsonFile = jsonDataRaw;

        // parse the JSON data
        const parsedJsonData = JSON.parse(jsonDataRaw);
        metadata.comicInfoJson = parsedJsonData;
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
async function compileRarCommentMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;
  if (archiveType === "rar") {
    const rarComment = await getRarComment(metadata.archivePath);
    metadata.comicbookinfoComment = rarComment;

    // parse the rar comment data
    const parsedRarCommentData = JSON.parse(rarComment);
    metadata.comicbookinfo = parsedRarCommentData;
  }

  return metadata;
}

async function compile7zArchiveXmlMetadata(
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
        const tempExtractPathOfXml = await extract7zEntryToTemp(
          metadata.archivePath,
          comicInfoXmlFile
        );

        const xmlDataRaw = await fs.promises.readFile(
          tempExtractPathOfXml,
          "utf-8"
        );
        metadata.comicInfoXmlFile = xmlDataRaw;

        // parse the xml data
        const parsedXmlData = parseXml(xmlDataRaw);
        metadata.comicInfoXml = parsedXmlData;
      }

      if (coMetXmlFile) {
        const tempExtractPathOfXml = await extract7zEntryToTemp(
          metadata.archivePath,
          coMetXmlFile
        );

        const xmlDataRaw = await fs.promises.readFile(
          tempExtractPathOfXml,
          "utf-8"
        );
        metadata.coMetXmlFile = xmlDataRaw;

        // parse the xml data
        const parsedXmlData = parseXml(xmlDataRaw);
        metadata.coMet = parsedXmlData;
      }
    }
  }

  return metadata;
}

async function compile7zArchiveJsonMetadata(
  metadata: MetadataCompiled
): Promise<MetadataCompiled> {
  const archiveType: string = metadata.archiveType;

  if (archiveType === "7z") {
    const jsonFilesIn7z: string[] = await get7zContentList(
      metadata.archivePath
    );

    if (jsonFilesIn7z.length > 0) {
      const comicInfoJsonFile = jsonFilesIn7z.find((file: string) =>
        file.endsWith("ComicInfo.json")
      );

      if (comicInfoJsonFile) {
        const tempExtractPathOfJson = await extract7zEntryToTemp(
          metadata.archivePath,
          comicInfoJsonFile
        );

        const jsonDataRaw = await fs.promises.readFile(
          tempExtractPathOfJson,
          "utf-8"
        );
        metadata.comicInfoJsonFile = jsonDataRaw;

        // parse the JSON data
        const parsedJsonData = JSON.parse(jsonDataRaw);
        metadata.comicInfoJson = parsedJsonData;
      }
    }
  }

  return metadata;
}
