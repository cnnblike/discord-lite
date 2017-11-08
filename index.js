let AnyProxy = require("anyproxy");
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const app = new Koa()

//providing PACFile here
const staticPath = './PACFile'
app.use(static(
  path.join( __dirname,  staticPath)
));
app.listen(3000, ()=>{
    console.log('PACFile serving at port 3000')
});

var options = {
        type : "http",
        port : 80,
        hostname: "discord.cnnblike.com",
        rule : require('./rule.js'),
        disableWebInterface: true,
        setAsGlobalProxy: false,
        silent: false,
forceProxyHttps: true
}
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => { /* */ });
proxyServer.on('error', (e) => { /* */ });
proxyServer.start();
