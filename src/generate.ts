import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import Papa from 'papaparse'
import { create as createTar } from 'tar'

import { getCompletion } from './chatgpt'
import { textToAudioFile } from './elevenlabs'
import { convertMp3ToOgg } from './ffmpeg'

function chunk(array: any[], size: number) {
  const chunkedArray = []
  for (let i = 0; i < array.length; i += size) {
   chunkedArray.push(array.slice(i, i + size))
  }
  return chunkedArray
}

const getFileMd5 = (path: string) => new Promise((resolve, reject) => {
  const hash = crypto.createHash('md5');
  const rs = fs.createReadStream(path);
  rs.on('error', reject);
  rs.on('data', chunk => hash.update(chunk));
  rs.on('end', () => resolve(hash.digest('hex')));
 })

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  try {
    console.log(`[Init] Cleaning ...`)
    try {
      await fs.promises.access(path.resolve('data/voices.csv'))
      await fs.promises.rm(path.resolve('data/voices.csv'))
    } catch { /**/ }

    try {
      await fs.promises.access(path.resolve('data/voices'))
      await fs.promises.rmdir(path.resolve('data/voices'))
    } catch { /**/ }
    await fs.promises.mkdir(path.resolve('data/voices'), { recursive: true })

    console.log(`[Init] Loading ...`)
    const originalPromtRaw = await fs.promises.readFile(path.resolve('data/prompt.txt'))
    const originalVoicesRaw = await fs.promises.readFile(path.resolve('data/original_voices.csv'))
    const prompt = `${originalPromtRaw}\n\n${originalVoicesRaw}`

    console.log(`[ChatGPT] Getting the voice lines ...`)
    const voicesCsv = await getCompletion(prompt)

    await fs.promises.writeFile(path.resolve('data/voices.csv'), voicesCsv, 'utf-8')

    console.log(`[ChatGPT] Parsing the voice lines ...`)
    const parsedFile = Papa.parse(voicesCsv, {
      delimiter: ';'
    })
    const parsedVoices = parsedFile.data as [string, string][]

    const chunkSize = 3
    const chunkedVoices = chunk(parsedVoices, chunkSize)

    for (const voices of chunkedVoices) {
      console.log(`[TTS] ${voices.map(([filename, text]) => `${filename} : ${text}`).join(' + ')} ...`)
      await Promise.all(voices.map(([filename, text]) => textToAudioFile(text, path.resolve('data/voices', filename))))
      await sleep(10)
    }

    for (const [filename] of parsedVoices) {
      console.log(`[Audio conversion] ${filename} ...`)
      await convertMp3ToOgg(path.resolve(`data/voices/${filename}`), path.resolve(`data/voices/${filename}`))
    }

    await createTar({
      gzip: true,
      file: path.resolve('data/voice_pack.tar.gz'),
      cwd: path.resolve('data/voices'),
    }, parsedVoices.map(([filename]) => filename))

    const md5 = await getFileMd5(path.resolve('data/voice_pack.tar.gz'))
    console.log(`Done ! MD5 : ${md5}`)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main()
