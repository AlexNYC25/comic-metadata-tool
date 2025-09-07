export declare function getZipContentList(filePath: string): Promise<string[]>;
export declare function getZipComment(filePath: string): Promise<string>;
export declare function doesZipContainXml(filePath: string): Promise<boolean>;
export declare function doesZipContainJson(filePath: string): Promise<boolean>;
export declare function getXmlFilesFromZip(filePath: string): Promise<string[]>;
export declare function getJsonFilesFromZip(filePath: string): Promise<string[]>;
export declare function extractZipEntryToTemp(zipPath: string, entryName: string, destDir?: string): Promise<string>;
/**
 * Directly extracts the content of a ZIP entry as a string without creating temporary files.
 * @param zipPath - The path to the ZIP archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export declare function getZipEntryContent(zipPath: string, entryName: string): Promise<string>;
//# sourceMappingURL=zip-utils.d.ts.map