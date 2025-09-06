import { MetadataCompiled } from "./src/interfaces/metadata-compiled";
export type { MetadataCompiled } from "./src/interfaces/metadata-compiled";
export type { ComicInfo } from "./src/interfaces/comicInfo";
export type { CoMet } from "./src/interfaces/comet";
export type { ComicBookInfo, ComicBookInfoPayload, } from "./src/interfaces/comicbookinfo";
export type { ComicPageInfo } from "./src/interfaces/metadata-parts/comic-page-info";
export type { CreditEntry } from "./src/interfaces/metadata-parts/credit-entry";
export type { AgeRating } from "./src/types/age-rating";
export type { ComicPageType } from "./src/types/comic-page-type";
export type { Manga } from "./src/types/manga";
export type { YesNo } from "./src/types/yes-no";
export interface ReadComicFileMetadataOptions {
    parseComicInfoXml?: boolean;
    parseComicBookInfo?: boolean;
    parseCoMet?: boolean;
}
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
export declare function readComicFileMetadata(filePath: string, options?: ReadComicFileMetadataOptions): Promise<MetadataCompiled>;
//# sourceMappingURL=index.d.ts.map