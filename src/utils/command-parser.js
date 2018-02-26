const commands = [
  {
    prefix: ':',
    actions: [
      {
        name: 'open',
        flags: ['t']
      },
      {
        name: 'set',
        properties: [
          {
            name: 'navbar',
            values: ['show', 'hide']
          }
        ]
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
const findAction = (prefix, action) => command(prefix).actions.find((act) => act.name === action )
const findProperty = (prefix, action, property) => findAction(prefix, action).properties.find((prop) => prop.name === property)
const flagsFor = (prefix, action) => findAction(prefix, action).flags
const propertiesFor = (prefix, action) => {
  let properties = findAction(prefix, action).properties

  if (properties) {
    return properties.map((property) => property.name)
  }
}
const valuesFor = (prefix, action, property) => findProperty(prefix, action, property).values

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

  var properties = propertiesFor(prefix, action)
  if (properties) {
    var [property, value] = argument.split(' ')
    response.property = property
    response.value = value

    var values = valuesFor(prefix, action, property)
    if (properties.indexOf(property) < 0) {
      response.error = `Invalid property "${property}"`
      return response
    }

    if (values.indexOf(value) < 0) {
      response.error = `Invalid value "${value}"`
      return response
    }
  }

  return response
}
