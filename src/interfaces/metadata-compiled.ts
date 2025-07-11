import { ComicInfo } from "./comicInfo";
import { CoMet } from "./comet";
import { ComicBookInfo } from "./comicbookinfo";

export interface MetadataCompiled {
  // The type of archive (zip, rar, etc.)
  archiveType: string;

  // The path to the archive file
  archivePath: string;

  // Flags to indicate if specific files are present in the archive
  xmlFilePresent: boolean;
  zipCommentPresent: boolean;

  // raw data from the archive
  comicInfoXmlFile?: string;
  coMetXmlFile?: string;
  comicbookinfoComment?: string;

  // Final metadata objects
  comicInfoXml?: ComicInfo;
  coMet?: CoMet;
  comicbookinfo?: ComicBookInfo;
}
