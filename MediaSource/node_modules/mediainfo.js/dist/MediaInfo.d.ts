import type { MediaInfoFactoryOptions } from './MediaInfoFactory';
import type { MediaInfoModule, WasmConstructableFormatType } from './MediaInfoModule';
import { type MediaInfoType } from './MediaInfoType';
/** Format of the result type */
type FormatType = 'object' | WasmConstructableFormatType;
type MediaInfoOptions<TFormat extends FormatType> = Required<Omit<MediaInfoFactoryOptions<TFormat>, 'locateFile'>>;
interface GetSizeFunc {
    (): Promise<number> | number;
}
interface ReadChunkFunc {
    (size: number, offset: number): Promise<Uint8Array> | Uint8Array;
}
interface ResultMap {
    object: MediaInfoType;
    JSON: string;
    XML: string;
    HTML: string;
    text: string;
}
declare const FORMAT_CHOICES: readonly ["JSON", "XML", "HTML", "text"];
declare const DEFAULT_OPTIONS: {
    readonly coverData: false;
    readonly chunkSize: number;
    readonly format: "object";
    readonly full: false;
};
type ResultCallback<TFormat extends FormatType> = (result: ResultMap[TFormat] | null, err?: unknown) => void;
/**
 * Convenience wrapper for MediaInfoLib WASM module.
 */
declare class MediaInfo<TFormat extends FormatType = typeof DEFAULT_OPTIONS.format> {
    private readonly mediainfoModule;
    private readonly mediainfoModuleInstance;
    readonly options: MediaInfoOptions<TFormat>;
    /**
     * Create an instance of MediaInfo. The constructor should not be called directly.
     * Instead use {@link MediaInfoFactory}.
     *
     * @param mediainfoModule WASM module
     * @param options User options
     */
    constructor(mediainfoModule: MediaInfoModule, options: MediaInfoOptions<TFormat>);
    /**
     * Convenience method for analyzing a buffer chunk by chunk.
     *
     * @param getSize Return total buffer size in bytes.
     * @param readChunk Read chunk of data and return an {@link Uint8Array}.
     */
    analyzeData(getSize: GetSizeFunc, readChunk: ReadChunkFunc): Promise<ResultMap[TFormat]>;
    /**
     * Convenience method for analyzing a buffer chunk by chunk.
     *
     * @param getSize Return total buffer size in bytes.
     * @param readChunk Read chunk of data and return an {@link Uint8Array}.
     * @param callback Function that is called once the processing is done
     */
    analyzeData(getSize: GetSizeFunc, readChunk: ReadChunkFunc, callback: ResultCallback<TFormat>): void;
    /**
     * Close the MediaInfoLib WASM instance.
     */
    close(): void;
    /**
     * Receive result data from the WASM instance.
     *
     * (This is a low-level MediaInfoLib function.)
     *
     * @returns Result data (format can be configured in options)
     */
    inform(): string;
    /**
     * Send more data to the WASM instance.
     *
     * (This is a low-level MediaInfoLib function.)
     *
     * @param data Data buffer
     * @param size Buffer size
     * @returns Processing state: `0` (no bits set) = not finished, Bit `0` set = enough data read for providing information
     */
    openBufferContinue(data: Uint8Array, size: number): boolean;
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
    openBufferContinueGotoGet(): number;
    /**
     * Inform MediaInfoLib that no more data is being read.
     */
    openBufferFinalize(): void;
    /**
     * Prepare MediaInfoLib to process a data buffer.
     *
     * @param size Expected buffer size
     * @param offset Buffer offset
     */
    openBufferInit(size: number, offset: number): void;
    /**
     * Parse result JSON. Convert integer/float fields.
     *
     * @param result Serialized JSON from MediaInfo
     * @returns Parsed JSON object
     */
    private parseResultJson;
}
export type { FormatType, GetSizeFunc, ReadChunkFunc, ResultMap };
export { DEFAULT_OPTIONS, FORMAT_CHOICES };
export default MediaInfo;
