import { createCommand, program } from 'commander';

program.name('one').version('v0.1.0').description('yet, vscode flavor architecture for pandora');

const assembler = createCommand('assembler');

assembler
  .argument('<monorepo>')
  .option('-w, --watch', 'whether continuous assemble')
  .action((monorepo, options) => {
    console.log('assembler');
    console.log(monorepo);
    console.log(options);
  });

program.addCommand(assembler);
program.parseAsync();
