#!/usr/bin/env node
import { program } from 'commander';
import { example } from './commands';

// If no command is given, then return the help
if (process.argv.length === 2) {
  console.log('\n> Error: Command is required\n');
  process.argv.push('-h');
}

program
  .command('test-command')
  .description('This is the first command registered')
  .action(example);

// == Add additional commands here ==
// program
//   .command('test-command')
//   .description('This is the first command registered')
//   .action(example);

program.parse();
