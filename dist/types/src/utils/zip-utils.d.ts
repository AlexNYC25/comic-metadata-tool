export declare function getZipContentList(filePath: string): Promise<string[]>;
export declare function getZipComment(filePath: string): Promise<string>;
export declare function doesZipContainXml(filePath: string): Promise<boolean>;
export declare function doesZipContainJson(filePath: string): Promise<boolean>;
export declare function getXmlFilesFromZip(filePath: string): Promise<string[]>;
export declare function getJsonFilesFromZip(filePath: string): Promise<string[]>;
export declare function extractZipEntryToTemp(zipPath: string, entryName: string, destDir?: string): Promise<string>;
//# sourceMappingURL=zip-utils.d.ts.map