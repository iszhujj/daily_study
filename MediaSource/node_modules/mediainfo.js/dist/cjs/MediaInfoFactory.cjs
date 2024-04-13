"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _MediaInfo = _interopRequireWildcard(require("./MediaInfo.cjs"));
var _MediaInfoModule = _interopRequireDefault(require("./MediaInfoModule.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
    ..._MediaInfo.DEFAULT_OPTIONS,
    ...options,
    format: options.format ?? _MediaInfo.DEFAULT_OPTIONS.format
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
  (0, _MediaInfoModule.default)(mediaInfoModuleFactoryOpts).then(wasmModule => callback(new _MediaInfo.default(wasmModule, mergedOptions))).catch(err => {
    if (errCallback) errCallback(err);
  });
}
var _default = MediaInfoFactory;
exports.default = _default;
//# sourceMappingURL=MediaInfoFactory.cjs.map
