import { expect, test } from "vitest";
import fs from "fs";
import path from "path";

import { getArchiveType } from "../src/utils/file-utils.ts";
import {
  get7zContentList,
  does7zContainXml,
  does7zContainJson,
  getXmlFilesFrom7z,
  getJsonFilesFrom7z,
  extract7zEntryToTemp,
} from "../src/utils/7z-utils.ts";

const sevenZipFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cb7";

const usingComicInfoVer2 = false;

test("getArchiveType - 7z", () => {
  const archiveType = getArchiveType(sevenZipFilePath);
  expect(archiveType).toBe("7z");
});

test("get7zContentList - 7z", async () => {
  const sevenZipContentList = await get7zContentList(sevenZipFilePath);
  expect(sevenZipContentList.length).toBeGreaterThan(0);
});

test("does7zContainXml - 7z", async () => {
  const containsXml = await does7zContainXml(sevenZipFilePath);
  expect(containsXml).toBe(true);
});

test("does7zContainJson - 7z", async () => {
  const containsJson = await does7zContainJson(sevenZipFilePath);
  if (usingComicInfoVer2) {
    expect(containsJson).toBe(true);
  } else {
    expect(containsJson).toBe(false);
  }
});

test("getXmlFilesFrom7z - 7z", async () => {
  const xmlFiles = await getXmlFilesFrom7z(sevenZipFilePath);
  expect(xmlFiles.length).toBeGreaterThan(0);
});

test("getJsonFilesFrom7z - 7z", async () => {
  const jsonFiles = await getJsonFilesFrom7z(sevenZipFilePath);

  if (usingComicInfoVer2) {
    expect(jsonFiles.length).toBeGreaterThan(0);
  } else {
    expect(jsonFiles.length).toBe(0);
  }
});

test("extract7zEntryToTemp - 7z", async () => {
  const extractPath = await extract7zEntryToTemp(
    sevenZipFilePath,
    "ComicInfo.xml"
  );

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("ComicInfo.xml");

  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});
