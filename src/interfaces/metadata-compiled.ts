export interface MetadataCompiled {
  // The type of archive (zip, rar, etc.)
  archiveType: string;

  // The path to the archive file
  archivePath: string;

  // Flags to indicate if specific files are present in the archive
  xmlFilePresent: boolean;
  jsonFilePresent: boolean;
  zipCommentPresent: boolean;

  // raw data from the archive
  comicInfoXmlFile: string;
  comicInfoJsonFile: string;
  coMetXmlFile: string;
  comicbookinfoComment: string;

  // Final metadata objects
  comicInfoXml: any;
  comicInfoJson: any;
  coMet: any;
  comicbookinfo: any;
}
