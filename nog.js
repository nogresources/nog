#!/usr/bin/env node

const program = require('commander');
const package = require('./package.json');
const installCmd = require ('./commands/install');

program.version(package.version);


// program.command('install [resource]').description('Adiciona um to-do').action(resource => installCmd(resource));
// program.command('update [resource]').description('Adiciona um to-do').action(resource => installCmd(resource));
// program.command('remove [resource]').description('Adiciona um to-do').action(resource => installCmd(resource));
// program.command('verify [resource]').description('Adiciona um to-do').action(resource => installCmd(resource));
// program.command('upload [resource]').description('Adiciona um to-do').action(resource => installCmd(resource));

// program.option('-ce, --config <email>', 'configura o email');
// program.option('-c, --cheese <type>', 'add the specified type of cheese', 'blue');

program.argument('<name>')
  .argument('[resource]')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, resource, options, command) => {

    switch(name) {
        case 'install': 
            installCmd(resource); 
            break;
        case 'update': 
            installCmd(resource); 
            break;
        case 'remove': 
            installCmd(resource); 
            break;
        case 'verify': 
            installCmd(resource); 
            break;
        case 'upload': 
            installCmd(resource); 
            break;
        default:
            console.log('unknown command. --help for details');
            return;
    }

    if (options.debug) {
      console.error('Called %s with options %o', command.name(), options);
    }
    // const title = options.title ? `${options.title} ` : '';
    // console.log(`Thank-you ${title}${name}`);
  });

program.parse(process.argv);

// 

// program.parse();

// 