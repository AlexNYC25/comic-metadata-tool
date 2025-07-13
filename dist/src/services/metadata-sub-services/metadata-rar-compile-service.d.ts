import { MetadataCompiled } from "../../interfaces/metadata-compiled";
/**
 * Compiles the XML metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export declare function compileRarArchiveXmlMetadata(metadata: MetadataCompiled): Promise<MetadataCompiled>;
/**
 * Compiles the ZIP comment metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export declare function compileRarCommentMetadata(metadata: MetadataCompiled): Promise<MetadataCompiled>;
//# sourceMappingURL=metadata-rar-compile-service.d.ts.map