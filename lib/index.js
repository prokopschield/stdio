'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getline =
    exports.getchar =
    exports.logger =
    exports.putline =
    exports.putchars =
        void 0;
const logger_1 = require('@lvksh/logger');
const Queue_1 = require('ps-std/lib/classes/Queue');
exports.putchars = process.stdout.write.bind(process.stdout);
function putline(line) {
    (0, exports.putchars)('\r\u001B[0J' + line + '\u001B[39m' + '\r\n');
}
exports.putline = putline;
exports.logger = (0, logger_1.createLogger)(
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
const queue = new Queue_1.Queue();
let charqueue = '';
let out = '';
process.stdin.on('data', (data) => {
    charqueue += String(data);
    queue.next_async();
    if (!paused && !queue.working && !getline_queue.working) {
        process.stdin.pause();
        paused = true;
    }
});
let paused = false;
async function getchar() {
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
exports.getchar = getchar;
const getline_queue = new Queue_1.Queue();
async function getline() {
    await getline_queue.promise;
    let chr = (out = '');
    while ((chr = await getchar()) !== '\r') {
        if (chr === '\u007F') {
            out = out.slice(0, -1);
            (0, exports.putchars)('\u001B[D \u001B[D');
        } else {
            out += chr;
            (0, exports.putchars)(chr);
        }
    }
    (0, exports.putchars)('\r\n');
    getline_queue.next_async();
    return out;
}
exports.getline = getline;
Object.assign(console, exports.logger);
Object.assign(process.stdout, {
    write: (text) => exports.logger.info(text.toString().trimEnd()),
});
Object.assign(process.stderr, {
    write: (text) => exports.logger.error(text.toString().trimEnd()),
});
