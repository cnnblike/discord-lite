const proxy = require("anyproxy");
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

!proxy.isRootCAFileExists() && proxy.generateRootCA();
var options = {
        type : "http",
        port : 8081,
        hostname: "discord.cnnblike.com",
        rule : require('./rule.js'),
        disableWebInterface: true,
        setAsGlobalProxy: false,
        silent: false
}
new proxy.proxyServer(options);