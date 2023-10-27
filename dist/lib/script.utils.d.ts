import { Command } from 'commander';
export default function (author: string, version: string, initFn: (command: Command) => void): {
    options: import("commander").OptionValues;
    arguments: string[];
    program: Command;
};
