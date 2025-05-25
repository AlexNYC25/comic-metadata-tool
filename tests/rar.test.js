import { expect, test } from "vitest";
import fs from "fs";
import path from "path";

import { getArchiveType } from "../src/utils/file-utils.ts";
import {
  getRarContentList,
  getRarComment,
  doesRarContainXml,
  doesRarContainJson,
  getXmlFilesFromRar,
  getJsonFilesFromRar,
  extractRarEntryToTemp,
} from "../src/utils/rar-utils.ts";

const rarFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbr";

const usingComicInfoVer2 = false;
test("getArchiveType - rar", () => {
  const archiveType = getArchiveType(rarFilePath);
  expect(archiveType).toBe("rar");
});

test("getRarContentList - rar", async () => {
  const rarContentList = await getRarContentList(rarFilePath);
  expect(rarContentList.length).toBeGreaterThan(0);
});

test("getRarComment - rar", async () => {
  const comment = await getRarComment(rarFilePath);
  expect(comment.length).toBeGreaterThan(0);
});

test("doesRarContainXml - rar", async () => {
  const containsXml = await doesRarContainXml(rarFilePath);
  expect(containsXml).toBe(true);
});

test("doesRarContainJson - rar", async () => {
  const containsJson = await doesRarContainJson(rarFilePath);
  if (usingComicInfoVer2) {
    expect(containsJson).toBe(true);
  } else {
    expect(containsJson).toBe(false);
  }
});

test("getXmlFilesFromRar - rar", async () => {
  const xmlFiles = await getXmlFilesFromRar(rarFilePath);
  expect(xmlFiles.length).toBeGreaterThan(0);
});

test("getJsonFilesFromRar - rar", async () => {
  const jsonFiles = await getJsonFilesFromRar(rarFilePath);

  if (usingComicInfoVer2) {
    expect(jsonFiles.length).toBeGreaterThan(0);
  } else {
    expect(jsonFiles.length).toBe(0);
  }
});

test("extractRarEntryToTemp - rar", async () => {
  const extractPath = await extractRarEntryToTemp(rarFilePath, "ComicInfo.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("ComicInfo.xml");

  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});
