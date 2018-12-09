var vkAuth = require('vk-auth')(6770112, 'messages');

vkAuth.authorize('89053178980', 'literatyra18');

vkAuth.on('error', function(err) {
    console.log(err);
});

vkAuth.on('auth', function(tokenParams) {
    //do something with token parameters
    console.log(tokenParams.access_token);
})