function FindProxyForURL(url, host)
{
    proxy = "PROXY 10.0.0.39:9092";
    if (shExpMatch(url, "\/index\.php\/(\d{4}?)\/Index\/index") && ((shExpMatch(host,"gf-(adrgw|ios)-cn-zs-game-0001\.ppgame\.com") || shExpMatch(host, "s\d{1,2}\.(gw|ios)\.gf\.game\.com"))))
        return proxy;
    return "DIRECT";
}
