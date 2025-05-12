import { CreditEntry } from "./metadata-parts/credit-entry";

/** Root object */
export interface ComicBookInfo {
  appID: string;
  lastModified: string;
  /** The detailed ComicBookInfo payload */
  "ComicBookInfo/1.0": ComicBookInfoPayload;
}

/** The nested payload under "ComicBookInfo/1.0" */
export interface ComicBookInfoPayload {
  series: string;
  title: string;
  publisher: string;
  publicationMonth: number;
  publicationYear: number;
  issue: number;
  numberOfIssues: number;
  volume: number;
  numberOfVolumes: number;
  rating: number;
  genre: string;
  language: string;
  country: string;
  credits: CreditEntry[];
  tags: string[];
  comments: string;
}
