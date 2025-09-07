export declare function get7zContentList(filePath: string): Promise<string[]>;
export declare function extract7zEntryToTemp(archivePath: string, entryName: string, destDir?: string): Promise<string>;
export declare function does7zContainXml(filePath: string): Promise<boolean>;
export declare function does7zContainJson(filePath: string): Promise<boolean>;
export declare function getXmlFilesFrom7z(filePath: string): Promise<string[]>;
export declare function getJsonFilesFrom7z(filePath: string): Promise<string[]>;
/**
 * Directly extracts the content of a 7z entry as a string without creating temporary files.
 * @param archivePath - The path to the 7z archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export declare function get7zEntryContent(archivePath: string, entryName: string): Promise<string>;
//# sourceMappingURL=7z-utils.d.ts.map