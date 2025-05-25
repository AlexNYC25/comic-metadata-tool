import { expect, test } from "vitest";
import fs from "fs";
import path from "path";

import { extractZipEntryToTemp } from "../src/utils/zip-utils.ts";
import { extractRarEntryToTemp } from "../src/utils/rar-utils.ts";
import { extract7zEntryToTemp } from "../src/utils/7z-utils.ts";
import { parseXml } from "../src/utils/xml-utils.ts";
import { isXmlObjectValidComicInfo } from "../src/utils/comicinfo.ts";
import { isXMLObjectValidCoMet } from "../src/utils/comet.ts";

const zipFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbz";
const rarFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbr";
const sevenZipFilePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cb7";

test("parseComicInfoXML - zip", async () => {
  const extractPath = await extractZipEntryToTemp(zipFilePath, "ComicInfo.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("ComicInfo.xml");

  const rawXml = fs.readFileSync(extractPath, "utf-8");
  const parsedXml = parseXml(rawXml);
  expect(parsedXml).toBeDefined();

  const isValidComicInfo = isXmlObjectValidComicInfo(parsedXml);
  expect(isValidComicInfo).toBe(true);

  const isValidCoMet = isXMLObjectValidCoMet(parsedXml);
  expect(isValidCoMet).toBe(false);

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});

test("parseCoMet - zip", async () => {
  const extractPath = await extractZipEntryToTemp(zipFilePath, "CoMet.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("CoMet.xml");

  const rawXml = fs.readFileSync(extractPath, "utf-8");
  const parsedXml = parseXml(rawXml);
  expect(parsedXml).toBeDefined();

  const isValidComicInfo = isXmlObjectValidComicInfo(parsedXml);
  expect(isValidComicInfo).toBe(false);

  const isValidCoMet = isXMLObjectValidCoMet(parsedXml);
  expect(isValidCoMet).toBe(true);

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});

test("parseComicInfoXML - cbr", async () => {
  const extractPath = await extractRarEntryToTemp(rarFilePath, "ComicInfo.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("ComicInfo.xml");

  const rawXml = fs.readFileSync(extractPath, "utf-8");
  const parsedXml = parseXml(rawXml);
  expect(parsedXml).toBeDefined();

  const isValidComicInfo = isXmlObjectValidComicInfo(parsedXml);
  expect(isValidComicInfo).toBe(true);

  const isValidCoMet = isXMLObjectValidCoMet(parsedXml);
  expect(isValidCoMet).toBe(false);

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});

test("parseCoMet - cbr", async () => {
  const extractPath = await extractRarEntryToTemp(rarFilePath, "CoMet.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("CoMet.xml");

  const rawXml = fs.readFileSync(extractPath, "utf-8");
  const parsedXml = parseXml(rawXml);
  expect(parsedXml).toBeDefined();

  const isValidComicInfo = isXmlObjectValidComicInfo(parsedXml);
  expect(isValidComicInfo).toBe(false);

  const isValidCoMet = isXMLObjectValidCoMet(parsedXml);
  expect(isValidCoMet).toBe(true);

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});

test("parseComicInfoXML - 7z", async () => {
  const extractPath = await extract7zEntryToTemp(
    sevenZipFilePath,
    "ComicInfo.xml"
  );

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("ComicInfo.xml");

  const rawXml = fs.readFileSync(extractPath, "utf-8");
  const parsedXml = parseXml(rawXml);
  expect(parsedXml).toBeDefined();

  const isValidComicInfo = isXmlObjectValidComicInfo(parsedXml);
  expect(isValidComicInfo).toBe(true);

  const isValidCoMet = isXMLObjectValidCoMet(parsedXml);
  expect(isValidCoMet).toBe(false);

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});

test("parseCoMet - 7z", async () => {
  const extractPath = await extract7zEntryToTemp(sevenZipFilePath, "CoMet.xml");

  expect(extractPath).toBeDefined();
  expect(extractPath).toContain("CoMet.xml");

  const rawXml = fs.readFileSync(extractPath, "utf-8");
  const parsedXml = parseXml(rawXml);
  expect(parsedXml).toBeDefined();

  const isValidComicInfo = isXmlObjectValidComicInfo(parsedXml);
  expect(isValidComicInfo).toBe(false);

  const isValidCoMet = isXMLObjectValidCoMet(parsedXml);
  expect(isValidCoMet).toBe(true);

  // Clean up the extracted file
  const tempFilePath = path.resolve(extractPath);
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  expect(fs.existsSync(tempFilePath)).toBe(false);
});
