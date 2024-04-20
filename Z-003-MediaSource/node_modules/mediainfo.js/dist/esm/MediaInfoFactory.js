import MediaInfo, { DEFAULT_OPTIONS } from "./MediaInfo.js";
import mediaInfoModuleFactory from "./MediaInfoModule.js";
const noopPrint = () => {
  // No-op
};
/**
 * This method will be called to look up the path for the `MediaInfoModule.wasm`
 * file. It handles the special case of loading from a CDN that serves
 * mediainfo.js from the root (e.g. `https://unpkg.com/mediainfo.js`).
 *
 * @see https://emscripten.org/docs/api_reference/module.html#Module.locateFile
 *
 * @param path File name
 * @param prefix Filepath prefix
 * @returns Full path to file
 */
function defaultLocateFile(path, prefix) {
  try {
    const url = new URL(prefix);
    if (url.pathname === '/') {
      return `${prefix}mediainfo.js/dist/${path}`;
    }
  } catch {}
  return `${prefix}../${path}`;
}

/**
 * Factory function for {@link MediaInfo}.
 *
 * @param options User options
 * @returns MediaInfo object
 */

/**
 * Factory function for {@link MediaInfoFactory}.
 *
 * @param options User options
 * @param callback Function that is called once the module is created
 */

/**
 * Factory function for {@link MediaInfoFactory}.
 *
 * @param options User options
 * @param callback Function that is called once the module is created
 * @param callback Error callback
 */

// TODO pass through all emscripten module options
function MediaInfoFactory(options = {}, callback, errCallback) {
  if (callback === undefined) {
    return new Promise((resolve, reject) => MediaInfoFactory(options, resolve, reject));
  }
  const {
    locateFile,
    ...mergedOptions
  } = {
    ...DEFAULT_OPTIONS,
    ...options,
    format: options.format ?? DEFAULT_OPTIONS.format
  };
  const mediaInfoModuleFactoryOpts = {
    // Silence all print in module
    print: noopPrint,
    printErr: noopPrint,
    locateFile: locateFile ? locateFile : defaultLocateFile,
    onAbort: err => {
      if (errCallback) {
        errCallback(err);
      }
    }
  };

  // Fetch and load WASM module
  mediaInfoModuleFactory(mediaInfoModuleFactoryOpts).then(wasmModule => callback(new MediaInfo(wasmModule, mergedOptions))).catch(err => {
    if (errCallback) errCallback(err);
  });
}
export default MediaInfoFactory;
//# sourceMappingURL=MediaInfoFactory.cjs.map
