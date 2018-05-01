function FindProxyForURL(url, host)
{
    proxy = "PROXY 10.0.0.39:9093";
    if (shExpMatch(url, "\/index\.php$") && shExpMatch(host, "ios\.transit\.gf\.ppgame\.com")){
        return proxy
    }
    return "DIRECT"
}