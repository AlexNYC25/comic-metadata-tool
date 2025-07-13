import { MetadataCompiled } from "./src/interfaces/metadata-compiled";
/**
 * All in one function to read the metadata of a comic archive file, reading metadata formats supported including:
 * - ComicInfo.xml
 * - ComicBookInfo
 * - CoMet
 *
 * from comic archive files such as .cbz, .cbr, .zip, .rar, .cb7, .7z
 * @param filePath - The path to the comic file as a string
 * @returns {Promise<MetadataCompiled>} - A promise that resolves to an object containing all possible metadata in one object
 * @throws {Error} - If the file is not a valid comic archive or if there is an error reading the metadata
 * @example
 * const metadata = await readComicFileMetadata('/path/to/Batman 001 (2016).cbz');
 * console.log(metadata);
 */
export declare function readComicFileMetadata(filePath: string, options?: {
    parseComicInfoXml?: boolean;
    parseComicBookInfo?: boolean;
    parseCoMet?: boolean;
}): Promise<MetadataCompiled>;
//# sourceMappingURL=index.d.ts.map