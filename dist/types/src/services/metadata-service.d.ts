import { MetadataCompiled } from "../interfaces/metadata-compiled";
import { MetadataWritePayload, MetadataWriteResult, WriteComicFileMetadataOptions } from "../interfaces/metadata-write";
/**
 * Service to read and compile metadata from the comic archive file for both XML and comment formats.
 * @param filePath - The path to the comic archive file.
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to the compiled metadata object.
 * @throws {Error} - Throws an error if the archive type is unsupported or if the file does not exist.
 */
export declare function getComicFileMetadata(filePath: string, options?: {
    parseComicInfoXml?: boolean;
    parseComicBookInfo?: boolean;
    parseCoMet?: boolean;
}): Promise<MetadataCompiled>;
/**
 * Service to write metadata back into a comic archive file.
 * @param filePath - The path to the comic archive file.
 * @param payload - The metadata payload to write.
 * @param options - Write options that determine target format behavior.
 * @returns {Promise<MetadataWriteResult>} - Information about the write operation.
 */
export declare function writeComicFileMetadata(filePath: string, payload: MetadataWritePayload, options?: WriteComicFileMetadataOptions): Promise<MetadataWriteResult>;
//# sourceMappingURL=metadata-service.d.ts.map