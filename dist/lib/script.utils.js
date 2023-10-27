"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const dotenv_1 = require("dotenv");
const terminal_utils_1 = require("./terminal.utils");
(0, dotenv_1.config)();
function NumericDateString(input) {
    const date = input !== null && input !== void 0 ? input : new Date();
    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes}${date.getSeconds()}`;
}
function default_1(author, version, initFn) {
    const defaultOutputName = `${commander_1.program
        .name()
        .replace(' ', '_')}.${NumericDateString()}.output`;
    commander_1.program.option('-d, --debug', 'Enables Debug Mode', false);
    commander_1.program.option('-D, --dry-run', 'Enables Debug Mode', false);
    commander_1.program.option('-o, --output <location>', 'Change default file output location', defaultOutputName);
    initFn(commander_1.program);
    commander_1.program.parse();
    (0, terminal_utils_1.drawScriptHeader)(commander_1.program.name(), { author, version });
    return {
        options: commander_1.program.opts(),
        arguments: commander_1.program.processedArgs,
        program: commander_1.program
    };
}
exports.default = default_1;
