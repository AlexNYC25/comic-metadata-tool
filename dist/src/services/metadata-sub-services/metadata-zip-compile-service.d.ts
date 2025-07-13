import { MetadataCompiled } from "../../interfaces/metadata-compiled";
/**
 * Compiles the XML metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export declare function compileZipArchiveXmlMetadata(metadata: MetadataCompiled): Promise<MetadataCompiled>;
/**
 * Compiles the ZIP comment metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export declare function compileZipCommentMetadata(metadata: MetadataCompiled): Promise<MetadataCompiled>;
//# sourceMappingURL=metadata-zip-compile-service.d.ts.map