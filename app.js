var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});

server.connection({ port: 3000 });

server.register(require('hapi-auth-cookie'), function (err) {
  server.auth.strategy('session', 'cookie', {
    password: '68x5dnc9',
    cookie: 'auth_cook',
    redirectTo: '/start',
    isSecure: false
  });
});

server.register(require('vision'), function(err) {

  if(err) {
    console.log("Vision error");
  }

  server.views({
    engines: { dust: require('hapi-dust') },
    relativeTo: Path.join(__dirname),
    path: 'views',
    partialsPath: 'views',
    isCached: false
  });

});

server.register(require('inert'), function (err) {
    if (err) {
      console.log("File error");
    }

    server.route({
      method: 'GET',
      path: '/script/{param*}',
      handler: {
        directory: {
            path:  Path.join(__dirname, 'public/script')
        }
      }
    });
});

var home = function(request, reply) {
  reply.view('base', { text: 'Hea lo' });
};

server.route([
  {
    method: 'GET',
    path: '/start',
    config: {
      handler: home
    }
  }
]);

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
