export declare function getRarContentList(filePath: string): Promise<string[]>;
export declare function getRarComment(filePath: string): Promise<string>;
export declare function extractRarEntryToTemp(rarPath: string, entryName: string, destDir?: string): Promise<string>;
export declare function doesRarContainXml(filePath: string): Promise<boolean>;
export declare function doesRarContainJson(filePath: string): Promise<boolean>;
export declare function getXmlFilesFromRar(filePath: string): Promise<string[]>;
export declare function getJsonFilesFromRar(filePath: string): Promise<string[]>;
/**
 * Directly extracts the content of a RAR entry as a string without creating temporary files.
 * @param rarPath - The path to the RAR archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export declare function getRarEntryContent(rarPath: string, entryName: string): Promise<string>;
//# sourceMappingURL=rar-utils.d.ts.map