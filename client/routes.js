const routes = require('next-routes')();

routes
    .add('/notices/new', '/notices/new')
    .add('/notices/:address', '/notices/show')


module.exports = routes;