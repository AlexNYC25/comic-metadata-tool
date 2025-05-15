"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get7zContentList = get7zContentList;
exports.extract7zEntryToTemp = extract7zEntryToTemp;
exports.does7zContainXml = does7zContainXml;
exports.does7zContainJson = does7zContainJson;
exports.getXmlFilesFrom7z = getXmlFilesFrom7z;
exports.getJsonFilesFrom7z = getJsonFilesFrom7z;
// zip-utils.ts
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const node_7z_1 = __importDefault(require("node-7z"));
const _7zip_bin_1 = __importDefault(require("7zip-bin"));
const fsp = fs_1.default.promises;
function get7zContentList(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const files = [];
            // point at the 7za binary from 7zip-bin
            const stream = node_7z_1.default.list(filePath, { $bin: _7zip_bin_1.default.path7za });
            stream.on("data", (entry) => {
                if (entry.file) {
                    files.push(entry.file);
                }
            });
            stream.on("end", () => resolve(files));
            stream.on("error", (err) => reject(err));
        });
    });
}
function extract7zEntryToTemp(archivePath, entryName, destDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Choose output base
        const outputBase = destDir
            ? destDir
            : yield fsp.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "7z-extract-"));
        // 2. Kick off a full‑path extract but cherry‑pick only our file
        const extractStream = node_7z_1.default.extractFull(archivePath, outputBase, {
            $bin: _7zip_bin_1.default.path7za,
            $cherryPick: [entryName],
        }); // :contentReference[oaicite:0]{index=0}
        // 3. Collect events and resolve when done
        return new Promise((resolve, reject) => {
            const seen = new Set();
            extractStream.on("data", (data) => {
                if (data.file) {
                    seen.add(data.file);
                }
            });
            extractStream.on("end", () => {
                // Did we get our target?
                if (!seen.has(entryName)) {
                    return reject(new Error(`Entry "${entryName}" not found in archive.`));
                }
                // Return the path where it was placed
                resolve(path_1.default.join(outputBase, entryName));
            });
            extractStream.on("error", (err) => {
                reject(err);
            });
        });
    });
}
function does7zContainXml(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield get7zContentList(filePath);
        return files.some((file) => file.endsWith(".xml"));
    });
}
function does7zContainJson(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield get7zContentList(filePath);
        return files.some((file) => file.endsWith(".json"));
    });
}
function getXmlFilesFrom7z(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield get7zContentList(filePath);
        return files.filter((file) => file.endsWith(".xml"));
    });
}
function getJsonFilesFrom7z(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield get7zContentList(filePath);
        return files.filter((file) => file.endsWith(".json"));
    });
}
