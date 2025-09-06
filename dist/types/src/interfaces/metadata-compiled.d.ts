import { ComicInfo } from "./comicInfo";
import { CoMet } from "./comet";
import { ComicBookInfo } from "./comicbookinfo";
export interface MetadataCompiled {
    archiveType: string;
    archivePath: string;
    xmlFilePresent: boolean;
    zipCommentPresent: boolean;
    comicInfoXmlFile?: string;
    coMetXmlFile?: string;
    comicbookinfoComment?: string;
    comicInfoXml?: ComicInfo;
    coMet?: CoMet;
    comicbookinfo?: ComicBookInfo;
}
//# sourceMappingURL=metadata-compiled.d.ts.map