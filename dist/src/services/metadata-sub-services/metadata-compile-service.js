"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileComicInfoXmlDataIntoMetadata = compileComicInfoXmlDataIntoMetadata;
exports.compileCoMetDataIntoMetadata = compileCoMetDataIntoMetadata;
const fs_1 = __importDefault(require("fs"));
const xml_utils_1 = require("../../utils/xml-utils");
const zip_utils_1 = require("../../utils/zip-utils");
const rar_utils_1 = require("../../utils/rar-utils");
const _7z_utils_1 = require("../../utils/7z-utils");
const metadata_compile_service_conversions_1 = require("./metadata-compile-service-conversions");
/**
 * Extracts raw XML content from an archive based on its type.
 * @param archiveType - The type of the archive (zip, rar, 7z).
 * @param archivePath - The path to the archive file.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The raw XML content as a string.
 * @throws {Error} - Throws an error if the archive type is unsupported.
 */
function getEntryRawContent(archiveType, archivePath, entryName) {
    return __awaiter(this, void 0, void 0, function* () {
        let tempExtractPathOfXml;
        switch (archiveType) {
            case "zip":
                tempExtractPathOfXml = yield (0, zip_utils_1.extractZipEntryToTemp)(archivePath, entryName);
                break;
            case "rar":
                tempExtractPathOfXml = yield (0, rar_utils_1.extractRarEntryToTemp)(archivePath, entryName);
                break;
            case "7z":
                tempExtractPathOfXml = yield (0, _7z_utils_1.extract7zEntryToTemp)(archivePath, entryName);
                break;
            default:
                throw new Error(`Unsupported archive type: ${archiveType}`);
        }
        // Read the extracted XML file
        const xmlDataRaw = yield fs_1.default.promises.readFile(tempExtractPathOfXml, "utf-8");
        // Clean up the temporary file
        yield fs_1.default.promises.unlink(tempExtractPathOfXml);
        return xmlDataRaw;
    });
}
/**
 * Converts the raw ComicInfo XML data to a ComicInfo object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param comicInfoXmlFile - The name of the ComicInfo XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
function compileComicInfoXmlDataIntoMetadata(metadata, comicInfoXmlFile) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract the raw XML content
        metadata.comicInfoXmlFile = yield getEntryRawContent(metadata.archiveType, metadata.archivePath, comicInfoXmlFile);
        // Parse the XML data
        const parsedXmlData = (0, xml_utils_1.parseXml)(metadata.comicInfoXmlFile || "");
        // Convert the parsed XML data to a ComicInfo object
        metadata.comicInfoXml = (0, metadata_compile_service_conversions_1.convertParsedXmlToComicInfo)(parsedXmlData);
        return metadata;
    });
}
/**
 * Converts the raw CoMet XML data to a CoMet object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param coMetXmlFile - The name of the CoMet XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
function compileCoMetDataIntoMetadata(metadata, coMetXmlFile) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract the raw XML content
        metadata.coMetXmlFile = yield getEntryRawContent(metadata.archiveType, metadata.archivePath, coMetXmlFile);
        // Parse the XML data
        const parsedXmlData = (0, xml_utils_1.parseXml)(metadata.coMetXmlFile || "");
        // Convert the parsed XML data to a CoMet object
        metadata.coMet = (0, metadata_compile_service_conversions_1.convertParsedXmlToCoMet)(parsedXmlData);
        return metadata;
    });
}
