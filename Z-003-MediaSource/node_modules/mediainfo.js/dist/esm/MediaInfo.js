import { FLOAT_FIELDS, INT_FIELDS } from "./MediaInfoType.js";
/** Format of the result type */
const FORMAT_CHOICES = ['JSON', 'XML', 'HTML', 'text'];
const DEFAULT_OPTIONS = {
  coverData: false,
  chunkSize: 256 * 1024,
  format: 'object',
  full: false
};
/**
 * Convenience wrapper for MediaInfoLib WASM module.
 */
class MediaInfo {
  /**
   * Create an instance of MediaInfo. The constructor should not be called directly.
   * Instead use {@link MediaInfoFactory}.
   *
   * @param mediainfoModule WASM module
   * @param options User options
   */
  constructor(mediainfoModule, options) {
    this.mediainfoModule = mediainfoModule;
    this.options = options;

    // Instantiate
    this.mediainfoModuleInstance = new mediainfoModule.MediaInfo(options.format === 'object' ? 'JSON' : options.format, options.coverData, options.full);
  }

  /**
   * Convenience method for analyzing a buffer chunk by chunk.
   *
   * @param getSize Return total buffer size in bytes.
   * @param readChunk Read chunk of data and return an {@link Uint8Array}.
   */

  /**
   * Convenience method for analyzing a buffer chunk by chunk.
   *
   * @param getSize Return total buffer size in bytes.
   * @param readChunk Read chunk of data and return an {@link Uint8Array}.
   * @param callback Function that is called once the processing is done
   */

  analyzeData(getSize, readChunk, callback) {
    // Support promise signature
    if (callback === undefined) {
      return new Promise((resolve, reject) => {
        const resultCb = (result, err) => err ? reject(err) : resolve(result);
        this.analyzeData(getSize, readChunk, resultCb);
      });
    }
    let offset = 0;
    const runReadDataLoop = fileSize => {
      const getChunk = () => {
        const readNextChunk = data => {
          if (continueBuffer(data)) {
            getChunk();
          } else {
            finalize();
          }
        };
        let dataValue;
        try {
          const safeSize = Math.min(this.options.chunkSize ?? DEFAULT_OPTIONS.chunkSize, fileSize - offset);
          dataValue = readChunk(safeSize, offset);
        } catch (e) {
          if (e instanceof Error) {
            return callback('', e);
          } else if (typeof e === 'string') {
            return callback('', new Error(e));
          }
        }
        if (dataValue instanceof Promise) {
          dataValue.then(readNextChunk).catch(e => callback('', e));
        } else if (dataValue !== undefined) {
          readNextChunk(dataValue);
        }
      };
      const continueBuffer = data => {
        if (data.length === 0 || this.openBufferContinue(data, data.length)) {
          return false;
        }
        const seekTo = this.openBufferContinueGotoGet();
        if (seekTo === -1) {
          offset += data.length;
        } else {
          offset = seekTo;
          this.openBufferInit(fileSize, seekTo);
        }
        return true;
      };
      const finalize = () => {
        this.openBufferFinalize();
        const result = this.inform();
        if (this.options.format === 'object') {
          callback(this.parseResultJson(result));
        } else {
          callback(result);
        }
      };
      this.openBufferInit(fileSize, offset);
      getChunk();
    };
    const fileSizeValue = getSize();
    if (fileSizeValue instanceof Promise) {
      fileSizeValue.then(runReadDataLoop).catch(err => callback(null, err));
    } else {
      runReadDataLoop(fileSizeValue);
    }
  }

  /**
   * Close the MediaInfoLib WASM instance.
   */
  close() {
    var _this$mediainfoModule;
    if (this.mediainfoModuleInstance) this.mediainfoModuleInstance.close();
    if (this.mediainfoModule && typeof ((_this$mediainfoModule = this.mediainfoModule) === null || _this$mediainfoModule === void 0 ? void 0 : _this$mediainfoModule.destroy) === 'function') this.mediainfoModule.destroy(this.mediainfoModuleInstance);
  }

  /**
   * Receive result data from the WASM instance.
   *
   * (This is a low-level MediaInfoLib function.)
   *
   * @returns Result data (format can be configured in options)
   */
  inform() {
    return this.mediainfoModuleInstance.inform();
  }

  /**
   * Send more data to the WASM instance.
   *
   * (This is a low-level MediaInfoLib function.)
   *
   * @param data Data buffer
   * @param size Buffer size
   * @returns Processing state: `0` (no bits set) = not finished, Bit `0` set = enough data read for providing information
   */
  openBufferContinue(data, size) {
    // bit 3 set -> done
    return !!(this.mediainfoModuleInstance.open_buffer_continue(data, size) & 0x08);
  }

  /**
   * Retrieve seek position from WASM instance.
   * The MediaInfoLib function `Open_Buffer_GoTo` returns an integer with 64 bit precision.
   * It would be cut at 32 bit due to the JavaScript bindings. Here we transport the low and high
   * parts separately and put them together.
   *
   * (This is a low-level MediaInfoLib function.)
   *
   * @returns Seek position (where MediaInfoLib wants go in the data buffer)
   */
  openBufferContinueGotoGet() {
    // JS bindings don't support 64 bit int
    // https://github.com/buzz/mediainfo.js/issues/11
    let seekTo = -1;
    const seekToLow = this.mediainfoModuleInstance.open_buffer_continue_goto_get_lower();
    const seekToHigh = this.mediainfoModuleInstance.open_buffer_continue_goto_get_upper();
    if (seekToLow == -1 && seekToHigh == -1) {
      seekTo = -1;
    } else if (seekToLow < 0) {
      seekTo = seekToLow + 4294967296 + seekToHigh * 4294967296;
    } else {
      seekTo = seekToLow + seekToHigh * 4294967296;
    }
    return seekTo;
  }

  /**
   * Inform MediaInfoLib that no more data is being read.
   */
  openBufferFinalize() {
    this.mediainfoModuleInstance.open_buffer_finalize();
  }

  /**
   * Prepare MediaInfoLib to process a data buffer.
   *
   * @param size Expected buffer size
   * @param offset Buffer offset
   */
  openBufferInit(size, offset) {
    this.mediainfoModuleInstance.open_buffer_init(size, offset);
  }

  /**
   * Parse result JSON. Convert integer/float fields.
   *
   * @param result Serialized JSON from MediaInfo
   * @returns Parsed JSON object
   */
  parseResultJson(resultString) {
    const intFields = INT_FIELDS;
    const floatFields = FLOAT_FIELDS;

    // Parse JSON
    const result = JSON.parse(resultString);
    if (result.media) {
      const newMedia = {
        ...result.media,
        track: []
      };
      if (result.media.track && Array.isArray(result.media.track)) {
        for (const track of result.media.track) {
          let newTrack = {
            '@type': track['@type']
          };
          for (const [key, val] of Object.entries(track)) {
            if (key === '@type') {
              continue;
            }
            if (typeof val === 'string' && intFields.includes(key)) {
              newTrack = {
                ...newTrack,
                [key]: parseInt(val, 10)
              };
            } else if (typeof val === 'string' && floatFields.includes(key)) {
              newTrack = {
                ...newTrack,
                [key]: parseFloat(val)
              };
            } else {
              newTrack = {
                ...newTrack,
                [key]: val
              };
            }
          }
          newMedia.track.push(newTrack);
        }
      }
      return {
        ...result,
        media: newMedia
      };
    }
    return result;
  }
}
export { DEFAULT_OPTIONS, FORMAT_CHOICES };
export default MediaInfo;
//# sourceMappingURL=MediaInfo.cjs.map
