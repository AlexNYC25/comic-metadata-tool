
import path from 'path';
import {getComicFileMetadata} from './src/services/metadata-service';

export async function readComicFileMetadata(filePath: string) {

    const properFilePath = path.resolve(filePath);

    const returnObj = await getComicFileMetadata(properFilePath)

    return returnObj;
}