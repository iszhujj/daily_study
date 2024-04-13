import MediaInfo, { DEFAULT_OPTIONS, type FormatType } from './MediaInfo';
interface MediaInfoFactoryOptions<TFormat extends FormatType> {
    /** Output cover data as base64 */
    coverData?: boolean;
    /** Chunk size used by `analyzeData` (in bytes) */
    chunkSize?: number;
    /** Result format */
    format?: TFormat;
    /** Full information display (all internal tags) */
    full?: boolean;
    /** Customize loading path for files */
    locateFile?(this: void, url: string, scriptDirectory: string): string;
}
type FactoryCallback<TFormat extends FormatType> = (mediainfo: MediaInfo<TFormat>) => void;
type ErrorCallback = (error: unknown) => void;
/**
 * Factory function for {@link MediaInfo}.
 *
 * @param options User options
 * @returns MediaInfo object
 */
declare function MediaInfoFactory<TFormat extends FormatType = typeof DEFAULT_OPTIONS.format>(options?: MediaInfoFactoryOptions<TFormat>): Promise<MediaInfo<TFormat>>;
/**
 * Factory function for {@link MediaInfoFactory}.
 *
 * @param options User options
 * @param callback Function that is called once the module is created
 */
declare function MediaInfoFactory<TFormat extends FormatType = typeof DEFAULT_OPTIONS.format>(options: MediaInfoFactoryOptions<TFormat>, callback: FactoryCallback<TFormat>): void;
/**
 * Factory function for {@link MediaInfoFactory}.
 *
 * @param options User options
 * @param callback Function that is called once the module is created
 * @param callback Error callback
 */
declare function MediaInfoFactory<TFormat extends FormatType = typeof DEFAULT_OPTIONS.format>(options: MediaInfoFactoryOptions<TFormat>, callback: FactoryCallback<TFormat>, errCallback: ErrorCallback): void;
export type { MediaInfoFactoryOptions };
export default MediaInfoFactory;
