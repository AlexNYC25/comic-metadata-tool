import { MetadataCompiled } from "../../interfaces/metadata-compiled";
export declare function compileZipArchiveXmlMetadata(metadata: MetadataCompiled, { parseComicInfoXml, parseCoMet, }?: {
    parseComicInfoXml?: boolean;
    parseCoMet?: boolean;
}): Promise<MetadataCompiled>;
/**
 * Compiles the ZIP comment metadata from a ZIP archive.
 * @param metadata - The metadata object containing archive information.
 * @param options - Options for parsing different metadata formats.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export declare function compileZipCommentMetadata(metadata: MetadataCompiled, { parseComicBookInfo, }: {
    parseComicBookInfo?: boolean;
}): Promise<MetadataCompiled>;
//# sourceMappingURL=metadata-zip-compile-service.d.ts.map