export declare function get7zContentList(filePath: string): Promise<string[]>;
export declare function extract7zEntryToTemp(archivePath: string, entryName: string, destDir?: string): Promise<string>;
export declare function does7zContainXml(filePath: string): Promise<boolean>;
export declare function does7zContainJson(filePath: string): Promise<boolean>;
export declare function getXmlFilesFrom7z(filePath: string): Promise<string[]>;
export declare function getJsonFilesFrom7z(filePath: string): Promise<string[]>;
//# sourceMappingURL=7z-utils.d.ts.map