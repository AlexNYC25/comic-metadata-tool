import { expect, test } from "vitest";
import fs from "fs";
import path from "path";

import { getArchiveType } from "../src/utils/file-utils.ts";
import {
  getZipContentList,
  getZipComment,
  doesZipContainXml,
  doesZipContainJson,
  getXmlFilesFromZip,
  getJsonFilesFromZip,
  extractZipEntryToTemp,
} from "../src/utils/zip-utils.ts";

const zipFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbz";

const usingComicInfoVer2 = false;

test("getArchiveType - zip", () => {
  const archiveType = getArchiveType(zipFilePath);
  expect(archiveType).toBe("zip");
});

test("getZipContentList - zip", async () => {
  const zipContentList = await getZipContentList(zipFilePath);
  expect(zipContentList.length).toBeGreaterThan(0);
});

test("getZipComment - zip", async () => {
  const comment = await getZipComment(zipFilePath);
  expect(comment.length).toBeGreaterThan(0);
});

test("doesZipContainXml - zip", async () => {
  const containsXml = await doesZipContainXml(zipFilePath);
  expect(containsXml).toBe(true);
});

test("doesZipContainJson - zip", async () => {
  const containsJson = await doesZipContainJson(zipFilePath);
  if (usingComicInfoVer2) {
    expect(containsJson).toBe(true);
  } else {
    expect(containsJson).toBe(false);
  }
});

test("getXmlFilesFromZip - zip", async () => {
  const xmlFiles = await getXmlFilesFromZip(zipFilePath);
  expect(xmlFiles.length).toBeGreaterThan(0);
});

test("getJsonFilesFromZip - zip", async () => {
  const jsonFiles = await getJsonFilesFromZip(zipFilePath);

  if (usingComicInfoVer2) {
    expect(jsonFiles.length).toBe(1);
  } else {
    expect(jsonFiles.length).toBe(0);
  }
});

test("extractZipEntryToTemp - zip", async () => {
  const extractPath = await extractZipEntryToTemp(zipFilePath, "ComicInfo.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("ComicInfo.xml");

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});
