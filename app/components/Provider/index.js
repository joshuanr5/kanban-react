// if(process.env.NODE_ENV === 'production') {
//     module.export = require('./Provider.prod');
// } else {
//     module.export = require('./Provider.dev');
// }

if(process.env.NODE_ENV === 'production') {
  module.exports = require('./Provider.prod');
}
else {
  module.exports = require('./Provider.dev');
}