import fs from 'node:fs'
import path from 'node:path'

import ffmpeg from 'fluent-ffmpeg'
import pathToFfmpeg from 'ffmpeg-static'
import { path as pathToFfprobe } from 'ffprobe-static'

ffmpeg.setFfmpegPath(pathToFfmpeg ?? '/')
ffmpeg.setFfprobePath(pathToFfprobe)

const runFfmpeg = (input: string, filters: string[], output: string, options: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const command = ffmpeg(input)
      .outputOptions(options)
      .audioFilters(filters)
      .output(output)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
    command.run();
  });
};

export const convertMp3ToOgg = async (inputFile: string, outputFile: string) => {
  const tmpfile = path.join(path.resolve('test.wav'))

  try {
    await runFfmpeg(inputFile, ['loudnorm=I=-14:LRA=1:dual_mono=true:tp=-1'], tmpfile, []);
    await runFfmpeg(tmpfile, [], outputFile,  [
      '-c:a libvorbis',
      '-b:a 100k',
      '-ar 16000',
    ]);
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    await fs.promises.unlink(tmpfile);
  }
}
