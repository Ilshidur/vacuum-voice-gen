import fs from 'node:fs'
import axios from 'axios'

export async function textToAudioFile(text: string, filepath: string) {
  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      text,
      model_id: 'eleven_multilingual_v2',
      // voice_settings: {
      //   stability: 0.7,
      //   similarity_boost: 0.87,
      //   style: 0.1,
      //   use_speaker_boost: true,
      // },
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      params: {
        output_format: 'mp3_44100_128',
        // optimize_streaming_latency: '4',
      },
      responseType: 'stream',
    }
  )

  response.data.pipe(fs.createWriteStream(filepath))

  return new Promise((resolve, reject) => {
    response.data.on('end', resolve)
    response.data.on('error', reject)
  })
}
