export declare function getRarContentList(filePath: string): Promise<string[]>;
export declare function getRarComment(filePath: string): Promise<string>;
export declare function extractRarEntryToTemp(rarPath: string, entryName: string, destDir?: string): Promise<string>;
export declare function doesRarContainXml(filePath: string): Promise<boolean>;
export declare function doesRarContainJson(filePath: string): Promise<boolean>;
export declare function getXmlFilesFromRar(filePath: string): Promise<string[]>;
export declare function getJsonFilesFromRar(filePath: string): Promise<string[]>;
//# sourceMappingURL=rar-utils.d.ts.map