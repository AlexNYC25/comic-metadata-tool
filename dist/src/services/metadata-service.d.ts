import { MetadataCompiled } from "../interfaces/metadata-compiled";
/**
 * Service to read and compile metadata from the comic archive file for both XML and comment formats.
 * @param filePath - The path to the comic archive file.
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to the compiled metadata object.
 * @throws {Error} - Throws an error if the archive type is unsupported or if the file does not exist.
 */
export declare function getComicFileMetadata(filePath: string): Promise<MetadataCompiled>;
//# sourceMappingURL=metadata-service.d.ts.map