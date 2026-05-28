import { getArchiveType } from "../../utils/file-utils.js";
import { getZipComment, getZipContentList, updateZipComment, upsertZipEntryContent, } from "../../utils/zip-utils.js";
import { getRarComment, getRarContentList, updateRarComment, upsertRarEntryContent, } from "../../utils/rar-utils.js";
import { get7zContentList, upsert7zEntryContent } from "../../utils/7z-utils.js";
import { serializeCoMetXml, serializeComicBookInfoComment, serializeComicInfoXml, } from "../../utils/xml-utils.js";
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
            return serializeComicInfoXml(payload.comicInfoXml);
        case "comet":
            if (!payload.coMet) {
                throw new Error('Missing payload.coMet for format "comet".');
            }
            return serializeCoMetXml(payload.coMet);
        case "comicbookinfo":
            if (!payload.comicbookinfo) {
                throw new Error('Missing payload.comicbookinfo for format "comicbookinfo".');
            }
            return serializeComicBookInfoComment(payload.comicbookinfo);
        default:
            throw new Error(`Unsupported metadata format: ${format}`);
    }
}
async function getExistingMetadataTargetsForZip(archivePath) {
    const archiveContents = await getZipContentList(archivePath);
    const zipComment = await getZipComment(archivePath);
    return {
        comicInfoXmlPaths: archiveContents.filter((file) => file.endsWith(COMIC_INFO_XML_FILE_NAME)),
        coMetXmlPaths: archiveContents.filter((file) => file.endsWith(COMET_XML_FILE_NAME)),
        hasComicBookInfoComment: zipComment.trim().length > 0,
    };
}
async function getExistingMetadataTargetsForRar(archivePath) {
    const archiveContents = await getRarContentList(archivePath);
    const archiveComment = await getRarComment(archivePath);
    return {
        comicInfoXmlPaths: archiveContents.filter((file) => file.endsWith(COMIC_INFO_XML_FILE_NAME)),
        coMetXmlPaths: archiveContents.filter((file) => file.endsWith(COMET_XML_FILE_NAME)),
        hasComicBookInfoComment: archiveComment.trim().length > 0,
    };
}
async function getExistingMetadataTargetsFor7z(archivePath) {
    const archiveContents = await get7zContentList(archivePath);
    return {
        comicInfoXmlPaths: archiveContents.filter((file) => file.endsWith(COMIC_INFO_XML_FILE_NAME)),
        coMetXmlPaths: archiveContents.filter((file) => file.endsWith(COMET_XML_FILE_NAME)),
        hasComicBookInfoComment: false,
    };
}
export async function writeComicFileMetadataIntoArchive(filePath, payload, options = {}) {
    const archiveType = getArchiveType(filePath);
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
                    await upsertZipEntryContent(filePath, targetPath, serializedComicInfo);
                }
                else if (archiveType === "rar") {
                    await upsertRarEntryContent(filePath, targetPath, serializedComicInfo);
                }
                else {
                    await upsert7zEntryContent(filePath, targetPath, serializedComicInfo);
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
                    await upsertZipEntryContent(filePath, targetPath, serializedCoMet);
                }
                else if (archiveType === "rar") {
                    await upsertRarEntryContent(filePath, targetPath, serializedCoMet);
                }
                else {
                    await upsert7zEntryContent(filePath, targetPath, serializedCoMet);
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
                await updateZipComment(filePath, serializedComicBookInfo);
            }
            else {
                await updateRarComment(filePath, serializedComicBookInfo);
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