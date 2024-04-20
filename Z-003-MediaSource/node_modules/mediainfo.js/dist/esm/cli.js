#!/usr/bin/env node
import { promises as fsPromises } from 'fs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { FORMAT_CHOICES } from "./MediaInfo.js";
import MediaInfoFactory from "./MediaInfoFactory.js";
const analyze = async ({
  coverData,
  file,
  format,
  full
}) => {
  let fileHandle;
  let fileSize;
  let mediainfo;
  if (!file) {
    throw TypeError('No file received!');
  }
  if (coverData && !['JSON', 'XML'].includes(format)) {
    throw TypeError('For cover data you need to choose JSON or XML as output format!');
  }
  const readChunk = async (size, offset) => {
    if (fileHandle === undefined) throw new Error('File unavailable');
    const buffer = new Uint8Array(size);
    await fileHandle.read(buffer, 0, size, offset);
    return buffer;
  };
  try {
    fileHandle = await fsPromises.open(file, 'r');
    fileSize = (await fileHandle.stat()).size;
    mediainfo = await MediaInfoFactory({
      format,
      coverData,
      full
    });
    if (mediainfo === undefined) {
      throw new Error('Failed to initialize MediaInfo');
    }
    console.log(await mediainfo.analyzeData(() => fileSize, readChunk));
  } finally {
    fileHandle && (await fileHandle.close());
    mediainfo && mediainfo.close();
  }
};
function parseArgs() {
  const yargsInstance = yargs(hideBin(process.argv));
  return yargsInstance.wrap(yargsInstance.terminalWidth()).option('format', {
    alias: 'f',
    default: 'text',
    describe: 'Choose format',
    choices: FORMAT_CHOICES
  }).option('cover-data', {
    default: false,
    describe: 'Output cover data as base64',
    type: 'boolean'
  }).option('full', {
    default: false,
    describe: 'Full information display (all internal tags)',
    type: 'boolean'
  }).command('$0 <file>', 'Show information about media file').positional('file', {
    describe: 'File to analyze',
    type: 'string'
  }).help('h').alias('h', 'help').fail((msg, err, argv) => {
    if (msg) {
      console.error(argv.help());
      console.error(msg);
    }
    if (err) {
      console.error(err.message);
    }
    process.exit(1);
  }).parseSync();
}
analyze(parseArgs()).catch(console.error);
//# sourceMappingURL=cli.cjs.map
