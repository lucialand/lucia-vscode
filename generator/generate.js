const jsonfile = require('jsonfile');
const { join } = require('path');

const attributes = require('./attributes.json');
const directives = require('./directives.json');
const events = require('./events.json');

const payload = {
  version: '1.1',
  globalAttributes: [],
};

for (const { name, description, url } of directives) {
  switch (name) {
    case ':':
    case 'l-bind:':
      for (const attribute of attributes) {
        payload.globalAttributes.push({
          name: `${name}${attribute.name}`,
          description: {
            kind: 'markdown',
            value: `${attribute.description}\n\n${description}`,
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
        payload.globalAttributes.push({
          name: `${name}${event.name}`,
          description: {
            kind: 'markdown',
            value: `${event.description}\n\n${description}`,
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

jsonfile.writeFile(join(__dirname, '../customData/html.json'), payload, (err) => {
  if (err) console.error(err)
})