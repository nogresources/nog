class NOG {
  constructor() {
    this.resourcePath = GetResourceMetadata(GetCurrentResourceName(), 'nog_resources_path', 0);
    this.nog_mirror = GetResourceMetadata(GetCurrentResourceName(), 'nog_mirror', 0);
    this.nog_description = GetResourceMetadata(GetCurrentResourceName(), 'description', 0);
    this.commands = {
      'install': require('./commands/install'),
      'i': require('./commands/install'),
      'resources': require('./commands/resources'),
      'r': require('./commands/resources'),
    };
    this.resources = [];
  }

  command(argument, resource = null, options = null) {
    options = this.resolveOptions(options);

    if (argument != null) {
      switch (argument) {
        case 'install':
        case 'i':
          this.commands[argument](this, resource, options)
          break;
        case 'update':
        case 'u':
          //todo
          break;
        case 'purge':
        case 'p':
          //todo
          break;
        case 'resources':
        case 'r':
          this.commands[argument](this)
          break;
        case 'mirror':
        case 'm':
          console.log('mirror:', this.nog_mirror);
          break;
        default:
          console.log('command not found')
      }
      return;
    }

    return console.log(this.nog_description);

  }

  resolveOptions(options) {
    if (options == null) return options;
    let ret = [];

    options.map(option => {
      let op = option.split('=');
      let op1 = op[0].replace('--', '');
      ret[op1] = op[1];
    })

    return ret;

  }

  getMirror() {
    return this.nog_mirror;
  }

  getPath() {
    return this.resourcePath;
  }

  getInfo(resource, key) {
    return GetNumResourceMetadata(resource, key) > 0 ? GetResourceMetadata(resource, key, 0) : null;
  }

  setResource(resource, seed, version = null, description = null, token = null) {
    this.resources.push({ resource: resource, seed: seed, token: token, version: version, description: description })
  }
}

const _Nog = new NOG();

on("onResourceStart", (resourceName) => {
  if (GetCurrentResourceName() != resourceName) {
    return;
  }

  let numResources = GetNumResources()

  for (let i = 0; i < numResources; i++) {
    var resource = GetResourceByFindIndex(i);

    if (GetNumResourceMetadata(resource, 'nog') > 0) {
      let version = _Nog.getInfo(resource, 'version');
      let description = _Nog.getInfo(resource, 'description');
      let nog_seed = _Nog.getInfo(resource, 'nog_seed');
      let nog_token = _Nog.getInfo(resource, 'nog_token');

      _Nog.setResource(resource, nog_seed, version, description, nog_token);

    }

  }

});


RegisterCommand('nog', function (source, args, rawCommand) {
  _Nog.command(args[0], args[1] || null, args.filter(arg => arg.includes('--')));
}, true);
