import { MetadataCompiled } from "../../interfaces/metadata-compiled";
/**
 * Converts the raw ComicInfo XML data to a ComicInfo object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param comicInfoXmlFile - The name of the ComicInfo XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
export declare function compileComicInfoXmlDataIntoMetadata(metadata: MetadataCompiled, comicInfoXmlFile: string): Promise<MetadataCompiled>;
/**
 * Converts the raw CoMet XML data to a CoMet object and updates the metadata.
 * @param metadata - The metadata object to update.
 * @param coMetXmlFile - The name of the CoMet XML file in the archive.
 * @returns {Promise<MetadataCompiled>} - The updated metadata object.
 */
export declare function compileCoMetDataIntoMetadata(metadata: MetadataCompiled, coMetXmlFile: string): Promise<MetadataCompiled>;
//# sourceMappingURL=metadata-compile-service.d.ts.map