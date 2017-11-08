function FindProxyForURL(url, host)
{
    proxy = "PROXY discord.cnnblike.com:8081";
    if (shExpMatch(host, "loginios.jianniang.com") || shExpMatch(host, "loginios.jr.moefantasy.com"))
        return proxy;
    return "DIRECT";
}
