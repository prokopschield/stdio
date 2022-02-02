import { createLogger } from '@lvksh/logger';
import { Queue } from 'ps-std/lib/classes/Queue';

export const putchars = process.stdout.write.bind(process.stdout);

export function putline(line: string) {
    putchars('\r\u001B[0J' + line + '\u001B[39m' + '\r\n');
}

export const logger = createLogger(
    {
        log: '\u001B[38;5;250m',
        info: '\u001B[38;5;250m',
        warn: '\u001B[38;2;255;137;0m',
        error: '\u001B[31m',
    },
    {
        paddingChar: '',
        divider: '',
    },
    putline
);

process.stdin.setEncoding('utf-8').setRawMode(true).resume();

const queue = new Queue();
let charqueue = '';
let out = '';

process.stdin.on('data', (data: string) => {
    charqueue += String(data);
    queue.next_async();

    if (!paused && !queue.working && !getline_queue.working) {
        process.stdin.pause();
        paused = true;
    }
});

let paused = false;

export async function getchar(): Promise<string> {
    if (charqueue.length > 0) {
        const [returnValue] = charqueue;

        charqueue = charqueue.slice(1);

        if (returnValue === '\t') {
            charqueue =
                ' '.repeat(4 - ((out.length + charqueue.length) % 4) || 4) +
                charqueue;

            return getchar();
        }

        return returnValue;
    } else {
        process.stdin.resume();
        paused = false;
        await queue.promise;

        return getchar();
    }
}

const getline_queue = new Queue();

export async function getline(): Promise<string> {
    await getline_queue.promise;
    let chr = (out = '');

    while ((chr = await getchar()) !== '\r') {
        if (chr === '\u007F') {
            out = out.slice(0, -1);
            putchars('\u001B[D \u001B[D');
        } else {
            out += chr;
            putchars(chr);
        }
    }

    putchars('\r\n');

    getline_queue.next_async();

    return out;
}

Object.assign(console, logger);

Object.assign(process.stdout, {
    write: (text: string) => logger.info(text.toString().trimEnd()),
});

Object.assign(process.stderr, {
    write: (text: string) => logger.error(text.toString().trimEnd()),
});
