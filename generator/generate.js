const jsonfile = require('jsonfile');
const { join } = require('path');

const properties = require('./properties.json');
const attributes = require('./attributes.json');
const directives = require('./directives.json');
const events = require('./events.json');

const payload = {
  version: '1.1',
  globalAttributes: [],
};

for (const { name, description, url } of directives) {
  switch (name) {
    case 'l-model':
      payload.globalAttributes.push({
        name: `${name}`,
        description: {
          kind: 'markdown',
          value: description,
        },
        references: [
          {
            name: `Documentation`,
            url,
          },
        ],
      });

      payload.globalAttributes.push({
        name: `${name}${properties[properties.length - 1].name}`,
        description: {
          kind: 'markdown',
          value: `${description}\n\n**Property:**\n${properties[properties.length - 1].description}`,
        },
        references: [
          {
            name: `Documentation`,
            url,
          },
        ],
      });
      break;
    case ':':
    case 'l-bind:':
      for (const attribute of attributes) {
        payload.globalAttributes.push({
          name: `${name}${attribute.name}`,
          description: {
            kind: 'markdown',
            value: `${description}\n\n**Attribute:**\n${attribute.description}`,
          },
          references: [
            {
              name: 'Documentation',
              url,
            },
          ],
        });
      }
      break;
    case '@':
    case 'l-on:':
      for (const event of events) {
        for (const property of [{ root: true, name: '', description: '' }, ...properties]) {
          let prop = property;

          if (!property.root && property.name === prop.name) {
            if ('l-on:' !== prop.target) {
              continue;
            }
          }
          payload.globalAttributes.push({
            name: `${name}${event.name}${prop.name}`,
            description: {
              kind: 'markdown',
              value: `${description}\n\n**Event:**\n${event.description}\n\n**Property:**\n${prop.description}`,
            },
            references: [
              {
                name: 'Documentation',
                url,
              },
            ],
          });
        }
      }

      break;
    default:
      payload.globalAttributes.push({
        name,
        description: {
          kind: 'markdown',
          value: description,
        },
        references: [
          {
            name: `Documentation`,
            url,
          },
        ],
      });
  }
}

for (const { name } of payload.globalAttributes) {
  console.log(name);
}

jsonfile.writeFile(join(__dirname, '../customData/html.json'), payload, (err) => {
  if (err) console.error(err);
});
