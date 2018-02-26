const commands = [
  {
    prefix: ':',
    actions: [
      {
        name: 'open',
        flags: ['t']
      },
      { name: 'tab-close' },
      { name: 'tab-focus' },
      { name: 'tab-clone' },
      { name: 'tab-next' },
      { name: 'tab-prev' },
      { name: 'tab-move' },
      { name: 'back' },
      { name: 'forward' },
      { name: 'reload' },
      { name: 'stop' },
      { name: 'inspect' },
      { name: 'undo' },
      { name: 'yank' }
    ]
  },
  { prefix: '/' }
]
const prefixes = commands.map((command) => command.prefix)
const command = (prefix) => commands.find((command) => command.prefix === prefix)
const actionsFor = (prefix) => command(prefix).actions.map((action) => action.name)
const flagsFor = (prefix, action) => command(prefix).actions.find((act) => act.name === action).flags
const action = (command, name) => command.actions.find((action) => action.name === name)

// TODO: Accept multiple flags
export default input => {
  if (!input) { return { error: 'Invalid command!' } }

  var [prefix, action, flag, argument] = input.match(/^(.)(\S*)\s*(?:\-(\S*))?\s*(.*)?/).slice(1)
  var response = { prefix, action, flag, argument }

  if (!prefix || (prefixes.indexOf(prefix) < 0)) {
    response.error = `Invalid prefix "${prefix}"`
    return response
  }

  var actions = actionsFor(prefix)
  if (!action || (actions.indexOf(action) < 0)) {
    response.error = `Invalid action "${action}"`
    return response
  }

  if (flag) {
    var flags = flagsFor(prefix, action)

    if (flags.indexOf(flag) < 0) {
      response.error = `Invalid flag "${flag}"`
      return response
    }
  }

  return response
}
