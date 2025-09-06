"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArchiveType = getArchiveType;
exports.getArchiveContentList = getArchiveContentList;
exports.getArchiveComment = getArchiveComment;
const buffer_1 = require("buffer");
const fs = __importStar(require("fs"));
const zip_utils_1 = require("./zip-utils");
const rar_utils_1 = require("./rar-utils");
const _7z_utils_1 = require("./7z-utils");
function getArchiveType(filePath) {
    const buffer = buffer_1.Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    const hex = buffer.toString('hex');
    if (hex.startsWith('504b')) {
        return 'zip'; // ZIP / CBZ
    }
    else if (hex.startsWith('526172211a0700')) {
        return 'rar'; // RAR 4.x / CBR
    }
    else if (hex.startsWith('526172211a070100')) {
        return 'rar'; // RAR 5.x / CBR
    }
    else if (hex.startsWith('377abcaf271c')) {
        return '7z'; // 7-Zip / CB7
    }
    return 'unknown';
}
async function getArchiveContentList(filePath) {
    const archiveType = getArchiveType(filePath);
    let contentList = [];
    switch (archiveType) {
        case 'zip':
            contentList = await (0, zip_utils_1.getZipContentList)(filePath);
            break;
        case 'rar':
            contentList = await (0, rar_utils_1.getRarContentList)(filePath);
            break;
        case '7z':
            contentList = await (0, _7z_utils_1.get7zContentList)(filePath);
            break;
        default:
            console.error('Unsupported archive type');
    }
    return contentList;
}
async function getArchiveComment(filePath) {
    const archiveType = getArchiveType(filePath);
    let comment = '';
    switch (archiveType) {
        case 'zip':
            comment = await (0, zip_utils_1.getZipComment)(filePath);
            break;
        case 'rar':
            comment = await (0, rar_utils_1.getRarComment)(filePath);
            break;
        case '7z':
            // 7z comment extraction is not implemented in this example
            console.error('7z comment extraction is not implemented');
            break;
        default:
            console.error('Unsupported archive type');
    }
    return comment;
}
//# sourceMappingURL=file-utils.js.map