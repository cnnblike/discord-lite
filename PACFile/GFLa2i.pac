function FindProxyForURL(url, host)
{
    proxy = "PROXY 10.0.0.39:9094";
    if (shExpMatch(url, "\/index\.php$") && shExpMatch(host, "adr\.transit\.gf\.ppgame\.com")){
        return proxy
    }
    return "DIRECT"
}