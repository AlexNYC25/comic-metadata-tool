"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeComicFileMetadataIntoArchive = writeComicFileMetadataIntoArchive;
const file_utils_1 = require("../../utils/file-utils");
const zip_utils_1 = require("../../utils/zip-utils");
const rar_utils_1 = require("../../utils/rar-utils");
const _7z_utils_1 = require("../../utils/7z-utils");
const xml_utils_1 = require("../../utils/xml-utils");
const COMIC_INFO_XML_FILE_NAME = "ComicInfo.xml";
const COMET_XML_FILE_NAME = "CoMet.xml";
function resolveWriteFormat(existingTargets, options = {}) {
    if (options.format) {
        return options.format;
    }
    const mirrorExistingFormat = options.mirrorExistingFormat ?? true;
    if (mirrorExistingFormat) {
        if (existingTargets.comicInfoXmlPaths.length > 0) {
            return "comicinfoxml";
        }
        if (existingTargets.coMetXmlPaths.length > 0) {
            return "comet";
        }
        if (existingTargets.hasComicBookInfoComment) {
            return "comicbookinfo";
        }
    }
    return "comicinfoxml";
}
function getSerializedMetadata(format, payload) {
    switch (format) {
        case "comicinfoxml":
            if (!payload.comicInfoXml) {
                throw new Error('Missing payload.comicInfoXml for format "comicinfoxml".');
            }
            return (0, xml_utils_1.serializeComicInfoXml)(payload.comicInfoXml);
        case "comet":
            if (!payload.coMet) {
                throw new Error('Missing payload.coMet for format "comet".');
            }
            return (0, xml_utils_1.serializeCoMetXml)(payload.coMet);
        case "comicbookinfo":
            if (!payload.comicbookinfo) {
                throw new Error('Missing payload.comicbookinfo for format "comicbookinfo".');
            }
            return (0, xml_utils_1.serializeComicBookInfoComment)(payload.comicbookinfo);
        default:
            throw new Error(`Unsupported metadata format: ${format}`);
    }
}
async function getExistingMetadataTargetsForZip(archivePath) {
    const archiveContents = await (0, zip_utils_1.getZipContentList)(archivePath);
    const zipComment = await (0, zip_utils_1.getZipComment)(archivePath);
    return {
        comicInfoXmlPaths: archiveContents.filter((file) => file.endsWith(COMIC_INFO_XML_FILE_NAME)),
        coMetXmlPaths: archiveContents.filter((file) => file.endsWith(COMET_XML_FILE_NAME)),
        hasComicBookInfoComment: zipComment.trim().length > 0,
    };
}
async function getExistingMetadataTargetsForRar(archivePath) {
    const archiveContents = await (0, rar_utils_1.getRarContentList)(archivePath);
    const archiveComment = await (0, rar_utils_1.getRarComment)(archivePath);
    return {
        comicInfoXmlPaths: archiveContents.filter((file) => file.endsWith(COMIC_INFO_XML_FILE_NAME)),
        coMetXmlPaths: archiveContents.filter((file) => file.endsWith(COMET_XML_FILE_NAME)),
        hasComicBookInfoComment: archiveComment.trim().length > 0,
    };
}
async function getExistingMetadataTargetsFor7z(archivePath) {
    const archiveContents = await (0, _7z_utils_1.get7zContentList)(archivePath);
    return {
        comicInfoXmlPaths: archiveContents.filter((file) => file.endsWith(COMIC_INFO_XML_FILE_NAME)),
        coMetXmlPaths: archiveContents.filter((file) => file.endsWith(COMET_XML_FILE_NAME)),
        hasComicBookInfoComment: false,
    };
}
async function writeComicFileMetadataIntoArchive(filePath, payload, options = {}) {
    const archiveType = (0, file_utils_1.getArchiveType)(filePath);
    if (archiveType === "unknown") {
        throw new Error("Unsupported archive type");
    }
    let existingTargets;
    switch (archiveType) {
        case "zip":
            existingTargets = await getExistingMetadataTargetsForZip(filePath);
            break;
        case "rar":
            existingTargets = await getExistingMetadataTargetsForRar(filePath);
            break;
        case "7z":
            existingTargets = await getExistingMetadataTargetsFor7z(filePath);
            break;
        default:
            throw new Error(`Writing metadata for archive type "${archiveType}" is not implemented yet.`);
    }
    const format = resolveWriteFormat(existingTargets, options);
    switch (format) {
        case "comicinfoxml": {
            const serializedComicInfo = getSerializedMetadata(format, payload);
            const targetPaths = existingTargets.comicInfoXmlPaths.length > 0
                ? existingTargets.comicInfoXmlPaths
                : [COMIC_INFO_XML_FILE_NAME];
            for (const targetPath of targetPaths) {
                if (archiveType === "zip") {
                    await (0, zip_utils_1.upsertZipEntryContent)(filePath, targetPath, serializedComicInfo);
                }
                else if (archiveType === "rar") {
                    await (0, rar_utils_1.upsertRarEntryContent)(filePath, targetPath, serializedComicInfo);
                }
                else {
                    await (0, _7z_utils_1.upsert7zEntryContent)(filePath, targetPath, serializedComicInfo);
                }
            }
            return {
                archivePath: filePath,
                archiveType,
                writtenFormat: format,
                createdMetadataFile: existingTargets.comicInfoXmlPaths.length === 0,
            };
        }
        case "comet": {
            const serializedCoMet = getSerializedMetadata(format, payload);
            const targetPaths = existingTargets.coMetXmlPaths.length > 0
                ? existingTargets.coMetXmlPaths
                : [COMET_XML_FILE_NAME];
            for (const targetPath of targetPaths) {
                if (archiveType === "zip") {
                    await (0, zip_utils_1.upsertZipEntryContent)(filePath, targetPath, serializedCoMet);
                }
                else if (archiveType === "rar") {
                    await (0, rar_utils_1.upsertRarEntryContent)(filePath, targetPath, serializedCoMet);
                }
                else {
                    await (0, _7z_utils_1.upsert7zEntryContent)(filePath, targetPath, serializedCoMet);
                }
            }
            return {
                archivePath: filePath,
                archiveType,
                writtenFormat: format,
                createdMetadataFile: existingTargets.coMetXmlPaths.length === 0,
            };
        }
        case "comicbookinfo": {
            if (archiveType === "7z") {
                throw new Error('ComicBookInfo comment metadata is not supported for archive type "7z".');
            }
            const serializedComicBookInfo = getSerializedMetadata(format, payload);
            if (archiveType === "zip") {
                await (0, zip_utils_1.updateZipComment)(filePath, serializedComicBookInfo);
            }
            else {
                await (0, rar_utils_1.updateRarComment)(filePath, serializedComicBookInfo);
            }
            return {
                archivePath: filePath,
                archiveType,
                writtenFormat: format,
                createdMetadataFile: !existingTargets.hasComicBookInfoComment,
            };
        }
        default:
            throw new Error(`Unsupported metadata format: ${format}`);
    }
}
//# sourceMappingURL=metadata-write-service.js.map