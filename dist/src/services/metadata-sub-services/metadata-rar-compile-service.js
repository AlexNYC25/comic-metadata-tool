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
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileRarArchiveXmlMetadata = compileRarArchiveXmlMetadata;
exports.compileRarCommentMetadata = compileRarCommentMetadata;
const rar_utils_1 = require("../../utils/rar-utils");
const metadata_compile_service_conversions_1 = require("./metadata-compile-service-conversions");
const metadata_compile_service_1 = require("./metadata-compile-service");
/**
 * Finds a specific XML file in the list of files.
 * @param files - List of files in the archive.
 * @param fileName - The name of the file to find.
 * @returns {string | undefined} - The file path if found, otherwise undefined.
 */
function findXmlFile(files, fileName) {
    return files.find((file) => file.endsWith(fileName));
}
/**
 * Compiles the XML metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
function compileRarArchiveXmlMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the list of XML files in the RAR archive
        const xmlFilesInRar = yield (0, rar_utils_1.getRarContentList)(metadata.archivePath);
        if (xmlFilesInRar.length === 0 || !metadata.xmlFilePresent) {
            return metadata; // No XML files to process
        }
        // Find specific XML files
        const comicInfoXmlFile = findXmlFile(xmlFilesInRar, "ComicInfo.xml");
        const coMetXmlFile = findXmlFile(xmlFilesInRar, "CoMet.xml");
        // Compile metadata from ComicInfo.xml if it exists
        if (comicInfoXmlFile) {
            metadata = yield (0, metadata_compile_service_1.compileComicInfoXmlDataIntoMetadata)(metadata, comicInfoXmlFile);
        }
        // Compile metadata from CoMet.xml if it exists
        if (coMetXmlFile) {
            metadata = yield (0, metadata_compile_service_1.compileCoMetDataIntoMetadata)(metadata, coMetXmlFile);
        }
        return metadata;
    });
}
/**
 * Compiles the ZIP comment metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
function compileRarCommentMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!metadata.zipCommentPresent) {
            return metadata; // No ZIP comment to process
        }
        try {
            // Get the RAR comment
            const rarComment = yield (0, rar_utils_1.getRarComment)(metadata.archivePath);
            metadata.comicbookinfoComment = rarComment;
            // Parse the RAR comment data
            const parsedRarCommentData = JSON.parse(rarComment);
            metadata.comicbookinfo =
                (0, metadata_compile_service_conversions_1.convertParsedArchiveCommentToComicbookinfo)(parsedRarCommentData);
        }
        catch (error) {
            // We can log the error but we don't want to throw it, we just want to return the metadata without the comment data/ atttepting to parse it
            console.error("Failed to parse RAR comment:", error);
        }
        return metadata;
    });
}
