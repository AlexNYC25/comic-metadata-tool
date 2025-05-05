import { Buffer } from 'buffer';
import * as fs from 'fs';

import { getZipContentList, getZipComment } from './zip-utils';
import { getRarContentList, getRarComment } from './rar-utils';
import { get7zContentList } from './7z-utils';

export type ArchiveType = 'zip' | 'rar' | '7z' | 'unknown';

export function getArchiveType(filePath: string): ArchiveType {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
  
    const hex = buffer.toString('hex');
  
    if (hex.startsWith('504b')) {
      return 'zip'; // ZIP / CBZ
    } else if (hex.startsWith('526172211a0700')) {
      return 'rar'; // RAR 4.x / CBR
    } else if (hex.startsWith('526172211a070100')) {
      return 'rar'; // RAR 5.x / CBR
    } else if (hex.startsWith('377abcaf271c')) {
      return '7z'; // 7-Zip / CB7
    }
  
    return 'unknown';
}

export async function getArchiveContentList(filePath: string): Promise<string[]> {
  const archiveType = getArchiveType(filePath);
  let contentList: string[] = [];

  switch (archiveType) {
    case 'zip':
      contentList = await getZipContentList(filePath);
      break;
    case 'rar':
      contentList = await getRarContentList(filePath);
      break;
    case '7z':
      contentList = await get7zContentList(filePath);
      break;
    default:
      console.error('Unsupported archive type');
  }

  return contentList;
}

export async function getArchiveComment(filePath: string): Promise<string> {
  const archiveType = getArchiveType(filePath);
  let comment: string = '';

  switch (archiveType) {
    case 'zip':
      comment = await getZipComment(filePath);
      break;
    case 'rar':
      comment = await getRarComment(filePath);
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