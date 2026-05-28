import fs from "fs/promises";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";
import { expect, test } from "vitest";

import { readComicFileMetadata, writeComicFileMetadata } from "../index.ts";

const zipFixturePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbz";
const rarFixturePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cbr";
const sevenZipFixturePath =
  "./tests/Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD).cb7";

const hasRarCli =
  spawnSync("sh", ["-c", "command -v rar >/dev/null 2>&1"]).status === 0 &&
  spawnSync("sh", ["-c", "command -v unrar >/dev/null 2>&1"]).status === 0;

async function copyFixtureToTemp(fixturePath, extension) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "comic-meta-write-"));
  const tempArchivePath = path.join(tempDir, `fixture-copy.${extension}`);

  await fs.copyFile(fixturePath, tempArchivePath);

  return { tempDir, tempArchivePath };
}

test("writeComicFileMetadata mirrors existing format (ComicInfo.xml) for ZIP", async () => {
  const { tempDir, tempArchivePath } = await copyFixtureToTemp(
    zipFixturePath,
    "cbz",
  );

  try {
    const before = await readComicFileMetadata(tempArchivePath, {
      parseComicInfoXml: true,
    });

    expect(before.comicInfoXml).toBeDefined();

    const updatedTitle = "Batman 001 - Updated By Test";

    const writeResult = await writeComicFileMetadata(tempArchivePath, {
      comicInfoXml: {
        ...before.comicInfoXml,
        title: updatedTitle,
      },
    });

    expect(writeResult.writtenFormat).toBe("comicinfoxml");
    expect(writeResult.createdMetadataFile).toBe(false);

    const after = await readComicFileMetadata(tempArchivePath, {
      parseComicInfoXml: true,
      parseCoMet: false,
      parseComicBookInfo: false,
    });

    expect(after.comicInfoXml?.title).toBe(updatedTitle);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("writeComicFileMetadata can explicitly write ComicBookInfo to ZIP comment", async () => {
  const { tempDir, tempArchivePath } = await copyFixtureToTemp(
    zipFixturePath,
    "cbz",
  );

  try {
    const before = await readComicFileMetadata(tempArchivePath, {
      parseComicBookInfo: true,
    });

    expect(before.comicbookinfo).toBeDefined();

    const writeResult = await writeComicFileMetadata(
      tempArchivePath,
      {
        comicbookinfo: {
          ...before.comicbookinfo,
          "ComicBookInfo/1.0": {
            ...before.comicbookinfo["ComicBookInfo/1.0"],
            title: "Batman 001 - Updated Comment Title",
          },
        },
      },
      {
        format: "comicbookinfo",
      },
    );

    expect(writeResult.writtenFormat).toBe("comicbookinfo");

    const after = await readComicFileMetadata(tempArchivePath, {
      parseComicBookInfo: true,
      parseComicInfoXml: false,
      parseCoMet: false,
    });

    expect(after.comicbookinfo?.["ComicBookInfo/1.0"]?.title).toBe(
      "Batman 001 - Updated Comment Title",
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("writeComicFileMetadata throws for unsupported archive write types", async () => {
  await expect(
    writeComicFileMetadata(
      sevenZipFixturePath,
      {
        comicbookinfo: {
          appID: "test",
          lastModified: "2026-05-28",
          "ComicBookInfo/1.0": {
            series: "Test",
            title: "Test",
            publisher: "Test",
            publicationMonth: 1,
            publicationYear: 2026,
            issue: 1,
            numberOfIssues: 1,
            volume: 1,
            numberOfVolumes: 1,
            rating: 0,
            genre: "",
            language: "",
            country: "",
            credits: [],
            tags: [],
            comments: "",
          },
        },
      },
      {
        format: "comicbookinfo",
      },
    ),
  ).rejects.toThrow(
    'ComicBookInfo comment metadata is not supported for archive type "7z".',
  );
});

test("writeComicFileMetadata updates ComicInfo.xml for 7z", async () => {
  const { tempDir, tempArchivePath } = await copyFixtureToTemp(
    sevenZipFixturePath,
    "cb7",
  );

  try {
    const before = await readComicFileMetadata(tempArchivePath, {
      parseComicInfoXml: true,
    });

    const updatedTitle = "Batman 001 - 7z Updated";

    const writeResult = await writeComicFileMetadata(tempArchivePath, {
      comicInfoXml: {
        ...before.comicInfoXml,
        title: updatedTitle,
      },
    });

    expect(writeResult.archiveType).toBe("7z");
    expect(writeResult.writtenFormat).toBe("comicinfoxml");

    const after = await readComicFileMetadata(tempArchivePath, {
      parseComicInfoXml: true,
      parseComicBookInfo: false,
      parseCoMet: false,
    });

    expect(after.comicInfoXml?.title).toBe(updatedTitle);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test.runIf(hasRarCli)(
  "writeComicFileMetadata updates ComicInfo.xml for rar",
  async () => {
    const { tempDir, tempArchivePath } = await copyFixtureToTemp(
      rarFixturePath,
      "cbr",
    );

    try {
      const before = await readComicFileMetadata(tempArchivePath, {
        parseComicInfoXml: true,
      });

      const updatedTitle = "Batman 001 - RAR Updated";

      const writeResult = await writeComicFileMetadata(tempArchivePath, {
        comicInfoXml: {
          ...before.comicInfoXml,
          title: updatedTitle,
        },
      });

      expect(writeResult.archiveType).toBe("rar");
      expect(writeResult.writtenFormat).toBe("comicinfoxml");

      const after = await readComicFileMetadata(tempArchivePath, {
        parseComicInfoXml: true,
        parseComicBookInfo: false,
        parseCoMet: false,
      });

      expect(after.comicInfoXml?.title).toBe(updatedTitle);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  },
);

test.skipIf(hasRarCli)(
  "writeComicFileMetadata fails for rar when CLI tools are unavailable",
  async () => {
    await expect(
      writeComicFileMetadata(rarFixturePath, {
        comicInfoXml: {
          title: "New title",
        },
      }),
    ).rejects.toThrow(
      'RAR write support requires both "rar" and "unrar" command-line tools.',
    );
  },
);
