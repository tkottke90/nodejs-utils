import { Command, program } from 'commander';
import { config } from 'dotenv';
import { drawScriptHeader } from './terminal.utils';

config();

function NumericDateString(input?: Date) {
  const date = input ?? new Date();

  return `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}${date.getHours()}${date.getMinutes}${date.getSeconds()}`;
}

export default function (
  author: string,
  version: string,
  initFn: (command: Command) => void
) {
  const defaultOutputName = `${program
    .name()
    .replace(' ', '_')}.${NumericDateString()}.output`;

  program.option('-d, --debug', 'Enables Debug Mode', false);
  program.option('-D, --dry-run', 'Enables Debug Mode', false);
  program.option(
    '-o, --output <location>',
    'Change default file output location',
    defaultOutputName
  );

  initFn(program);

  program.parse();

  drawScriptHeader(program.name(), { author, version });

  return {
    options: program.opts(),
    arguments: program.processedArgs as string[],
    program
  };
}
