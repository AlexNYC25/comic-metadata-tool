import { expect, test } from "vitest";

import { getComicFileMetadata } from "../src/services/metadata-service.ts";

const zipFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbz";
const rarFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbr";
const sevenZipFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cb7";

test("getComicFileMetadata - zip", async () => {
  const metadata = await getComicFileMetadata(zipFilePath, {
    parseComicInfoXml: true,
  });

  expect(metadata).toBeDefined();
  expect(metadata.archiveType).toBe("zip");
  expect(metadata.xmlFilePresent).toBe(true);
  expect(metadata.zipCommentPresent).toBe(true);
  expect(metadata.comicInfoXmlFile.length).toBeGreaterThan(0);
  expect(metadata.coMetXmlFile.length).toBeGreaterThan(0);
  expect(metadata.comicbookinfoComment.length).toBeGreaterThan(0);
  expect(metadata.comicInfoXml).toBeDefined();
  expect(metadata.coMet).toBeDefined();
  expect(metadata.comicbookinfo).toBeDefined();
});

test("getComicFileMetadata - rar", async () => {
  const metadata = await getComicFileMetadata(rarFilePath, {
    parseComicInfoXml: true,
  });

  expect(metadata).toBeDefined();
  expect(metadata.archiveType).toBe("rar");
  expect(metadata.xmlFilePresent).toBe(true);
  expect(metadata.zipCommentPresent).toBe(true);
  expect(metadata.comicInfoXmlFile.length).toBeGreaterThan(0);
  expect(metadata.coMetXmlFile.length).toBeGreaterThan(0);
  expect(metadata.comicbookinfoComment.length).toBeGreaterThan(0);
  expect(metadata.comicInfoXml).toBeDefined();
  expect(metadata.coMet).toBeDefined();
  expect(metadata.comicbookinfo).toBeDefined();
});

test("getComicFileMetadata - 7z", async () => {
  const metadata = await getComicFileMetadata(sevenZipFilePath);

  expect(metadata).toBeDefined();
  expect(metadata.archiveType).toBe("7z");
  expect(metadata.xmlFilePresent).toBe(true);
  expect(metadata.zipCommentPresent).toBe(false);
  expect(metadata.comicInfoXmlFile.length).toBeGreaterThan(0);
  expect(metadata.coMetXmlFile.length).toBeGreaterThan(0);
  expect(metadata.comicbookinfoComment.length).toBe(0);
  expect(metadata.comicInfoXml).toBeDefined();
  expect(metadata.coMet).toBeDefined();
  expect(metadata.comicbookinfo).toBeUndefined();
});
