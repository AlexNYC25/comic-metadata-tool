export type ArchiveType = 'zip' | 'rar' | '7z' | 'unknown';
export declare function getArchiveType(filePath: string): ArchiveType;
export declare function getArchiveContentList(filePath: string): Promise<string[]>;
export declare function getArchiveComment(filePath: string): Promise<string>;
//# sourceMappingURL=file-utils.d.ts.map