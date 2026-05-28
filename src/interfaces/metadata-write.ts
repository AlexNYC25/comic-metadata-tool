import { CoMet } from "./comet";
import { ComicBookInfo } from "./comicbookinfo";
import { ComicInfo } from "./comicInfo";

export type MetadataWriteFormat = "comicinfoxml" | "comet" | "comicbookinfo";

export interface MetadataWritePayload {
  comicInfoXml?: ComicInfo;
  coMet?: CoMet;
  comicbookinfo?: ComicBookInfo;
}

export interface WriteComicFileMetadataOptions {
  format?: MetadataWriteFormat;
  mirrorExistingFormat?: boolean;
}

export interface MetadataWriteResult {
  archivePath: string;
  archiveType: string;
  writtenFormat: MetadataWriteFormat;
  createdMetadataFile: boolean;
}
