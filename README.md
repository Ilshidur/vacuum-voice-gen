# vacuum-voice-gen

**Generate the voice of your rooted Dreame vacuum robot using ChatGPT and ElevenLabs.**

## Requirements

- A Linux environment.
- [Bun.](https://bun.sh)

## Usage

### Set the environment variables

Copy `.env.dist` to `.env` and fill in the environment variables.

### Edit the ChatGPT prompt

The voice lines are generated using the personality of a character described in a ChatGPT prompt, which is located in `data/prompt.txt`.
Sorry, for my use I've written this in French but feel free to translate it back to your native language before editing it.

### Generating the audio files

```bash
bun install
bun run src/generate.ts
```

The output files are in `data/voices` and `data/voice_pack.tar.gz`.

### Importing the audio files

Please refer to https://github.com/Findus23/voice_pack_dreame#installation.

## Example of voices

You can import an example of a French voice pack I made for my personal use.

Archive : `https://github.com/Ilshidur/vacuum-voice-gen/releases/download/1.0.0/voice_pack.tar.gz`
md5 : `c86c7dc23fb2432ba9ed21e391904197`
And just call it `BASTIANO`.

## TODO

I'll add a Docker image later.

## Credits

Thanks a lot to Findus23 who maintains https://github.com/Findus23/voice_pack_dreame, which I heavily copied.

<hr/>

<p align="center">
  Don't forget to 🌟 Star 🌟 the repo if you like this project !<br/>
  <a href="https://github.com/Ilshidur/vacuum-voice-gen/issues/new">Your feedback is appreciated</a>
</p>
