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
exports.getComicFileMetadata = getComicFileMetadata;
const fs_1 = __importDefault(require("fs"));
const file_utils_1 = require("../utils/file-utils");
const zip_utils_1 = require("../utils/zip-utils");
const rar_utils_1 = require("../utils/rar-utils");
const _7z_utils_1 = require("../utils/7z-utils");
const metadata_zip_compile_service_1 = require("./metadata-sub-services/metadata-zip-compile-service");
const metadata_rar_compile_service_1 = require("./metadata-sub-services/metadata-rar-compile-service");
const metadata_7z_compile_service_1 = require("./metadata-sub-services/metadata-7z-compile-service");
/**
 * Processes metadata for a given archive type, compiling XML and comment metadata as needed with the provided functions.
 * @param metadata - The metadata object to process.
 * @param compileXmlMetadata - Function to compile XML metadata.
 * @param compileCommentMetadata - Optional function to compile comment metadata.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
function processMetadata(metadata, compileXmlMetadata, compileCommentMetadata) {
    return __awaiter(this, void 0, void 0, function* () {
        if (metadata.xmlFilePresent) {
            metadata = yield compileXmlMetadata(metadata);
        }
        if (metadata.zipCommentPresent && compileCommentMetadata) {
            metadata = yield compileCommentMetadata(metadata);
        }
        return metadata;
    });
}
/**
 * Service to read and compile metadata from the comic archive file for both XML and comment formats.
 * @param filePath - The path to the comic archive file.
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to the compiled metadata object.
 * @throws {Error} - Throws an error if the archive type is unsupported or if the file does not exist.
 */
function getComicFileMetadata(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the file exists
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        // Determine the archive type
        const archiveType = (0, file_utils_1.getArchiveType)(filePath);
        const supportedArchiveTypes = new Set(["zip", "rar", "7z"]);
        if (!supportedArchiveTypes.has(archiveType)) {
            throw new Error("Unsupported archive type");
        }
        // Initialize the metadata object
        const metadata = {
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
                metadata.xmlFilePresent = yield (0, zip_utils_1.doesZipContainXml)(filePath);
                metadata.zipCommentPresent = (yield (0, zip_utils_1.getZipComment)(filePath)) !== "";
                return processMetadata(metadata, metadata_zip_compile_service_1.compileZipArchiveXmlMetadata, metadata_zip_compile_service_1.compileZipCommentMetadata);
            case "rar":
                metadata.xmlFilePresent = yield (0, rar_utils_1.doesRarContainXml)(filePath);
                metadata.zipCommentPresent = (yield (0, rar_utils_1.getRarComment)(filePath)) !== "";
                return processMetadata(metadata, metadata_rar_compile_service_1.compileRarArchiveXmlMetadata, metadata_rar_compile_service_1.compileRarCommentMetadata);
            case "7z":
                metadata.xmlFilePresent = yield (0, _7z_utils_1.does7zContainXml)(filePath);
                return processMetadata(metadata, metadata_7z_compile_service_1.compile7zArchiveXmlMetadata);
            default:
                throw new Error("Unexpected archive type");
        }
    });
}
