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
exports.readComicFileMetadata = readComicFileMetadata;
const path_1 = __importDefault(require("path"));
const metadata_service_1 = require("./src/services/metadata-service");
/**
 * All in one function to read the metadata of a comic archive file, reading metadata formats supported including:
 * - ComicInfo.xml
 * - ComicBookInfo
 * - CoMet
 *
 * from comic archive files such as .cbz, .cbr, .zip, .rar, .cb7, .7z
 * @param filePath - The path to the comic file as a string
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to an object containing all possible metadata in one object
 * @throws {Error} - If the file is not a valid comic archive or if there is an error reading the metadata
 * @example
 * const metadata = await readComicFileMetadata('/path/to/Batman 001 (2016).cbz');
 * console.log(metadata);
 */
function readComicFileMetadata(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const properFilePath = path_1.default.resolve(filePath);
        const returnObj = yield (0, metadata_service_1.getComicFileMetadata)(properFilePath);
        return returnObj;
    });
}
