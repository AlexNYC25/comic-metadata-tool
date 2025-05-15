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
exports.compile7zArchiveXmlMetadata = compile7zArchiveXmlMetadata;
const _7z_utils_1 = require("../../utils/7z-utils");
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
 * Compiles metadata from a 7z archive by processing ComicInfo.xml and CoMet.xml files.
 * @param metadata - The metadata object to update.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
function compile7zArchiveXmlMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the list of XML files in the 7z archive
        const xmlFilesIn7z = yield (0, _7z_utils_1.get7zContentList)(metadata.archivePath);
        if (xmlFilesIn7z.length === 0) {
            return metadata; // No XML files to process
        }
        // Find specific XML files
        const comicInfoXmlFile = findXmlFile(xmlFilesIn7z, "ComicInfo.xml");
        const coMetXmlFile = findXmlFile(xmlFilesIn7z, "CoMet.xml");
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
