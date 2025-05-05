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
function getComicFileMetadata(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const archiveType = (0, file_utils_1.getArchiveType)(filePath);
        if (archiveType === 'unknown') {
            throw new Error('Unsupported archive type');
        }
        switch (archiveType) {
            case 'zip':
                let compiiledMetadataObj = {
                    archiveType: archiveType,
                    xmlFilePresent: yield (0, zip_utils_1.doesZipContainXml)(filePath),
                    jsonFilePresent: yield (0, zip_utils_1.doesZipContainJson)(filePath),
                    zipComment: '',
                    xmlData: '',
                    jsonData: '',
                    zipCommentData: '',
                    xmlFormat: '',
                    jsonFormat: '',
                    xmlParsedData: null,
                    jsonParsedData: null,
                    zipCommentParsedData: null
                };
                if (compiiledMetadataObj.xmlFilePresent) {
                    const getXmlFilesFromZip = yield (0, zip_utils_1.getZipContentList)(filePath);
                    if (getXmlFilesFromZip.length > 0) {
                        const tempExtractPathOfXml = yield (0, zip_utils_1.extractZipEntryToTemp)(filePath, getXmlFilesFromZip[0]);
                        const xmlDataRaw = yield fs_1.default.promises.readFile(tempExtractPathOfXml, 'utf-8');
                        compiiledMetadataObj.xmlData = xmlDataRaw;
                    }
                }
                if (compiiledMetadataObj.jsonFilePresent) {
                    const getJsonFilesFromZip = yield (0, zip_utils_1.getZipContentList)(filePath);
                    if (getJsonFilesFromZip.length > 0) {
                        const tempExtractPathOfJson = yield (0, zip_utils_1.extractZipEntryToTemp)(filePath, getJsonFilesFromZip[0]);
                    }
                }
                if (compiiledMetadataObj.zipComment !== '') {
                    const parsedZipComment = compiiledMetadataObj.zipComment.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
                }
        }
    });
}
