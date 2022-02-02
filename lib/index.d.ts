/// <reference types="node" />
export declare const putchars: {
    (
        buffer: string | Uint8Array,
        cb?: ((err?: Error | undefined) => void) | undefined
    ): boolean;
    (
        str: string | Uint8Array,
        encoding?: BufferEncoding | undefined,
        cb?: ((err?: Error | undefined) => void) | undefined
    ): boolean;
};
export declare function putline(line: string): void;
export declare const logger: import('@lvksh/logger').Logger<
    'error' | 'log' | 'info' | 'warn'
>;
export declare function getchar(): Promise<string>;
export declare function getline(): Promise<string>;
