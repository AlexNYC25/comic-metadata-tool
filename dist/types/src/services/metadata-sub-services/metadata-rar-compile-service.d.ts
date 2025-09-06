import { MetadataCompiled } from "../../interfaces/metadata-compiled";
/**
 * Compiles the XML metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with XML data.
 */
export declare function compileRarArchiveXmlMetadata(metadata: MetadataCompiled, { parseComicInfoXml, parseCoMet, }: {
    parseComicInfoXml?: boolean;
    parseCoMet?: boolean;
}): Promise<MetadataCompiled>;
/**
 * Compiles the ZIP comment metadata from a RAR archive.
 * @param metadata - The metadata object containing archive information.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object with ZIP comment data.
 */
export declare function compileRarCommentMetadata(metadata: MetadataCompiled, { parseComicBookInfo, }: {
    parseComicBookInfo?: boolean;
}): Promise<MetadataCompiled>;
//# sourceMappingURL=metadata-rar-compile-service.d.ts.map