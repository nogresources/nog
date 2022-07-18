class NOG {
  constructor() {
    this.resourcePath = GetResourceMetadata(GetCurrentResourceName(), 'nog_resources_path', 0);
    this.nog_mirror = GetResourceMetadata(GetCurrentResourceName(), 'nog_mirror', 0);
    this.commands = {
      'install': require('./commands/install'),
      'resources': require('./commands/resources'),
    };
    this.resources = [];
  }

  command(argument, resource = null, options = null) {
    switch (argument) {
      case 'install':
        this.commands[argument](this, resource, options)
        break;
      case 'resources':
        this.commands[argument](this)
        break;
      case 'mirror':
        console.log('mirror:', this.nog_mirror);
        break;
      default:
        console.log('command not found')
    }
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

  setResource(resource, seed, version = null, description = null, token = null){
    this.resources.push({resource: resource, seed: seed, token: token, version: version, description: description})
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
