function FindProxyForURL(url, host)
{
    proxy = "PROXY discord.cnnblike.com:8081";
    if (shExpMatch(host, "proxy.cnnblike.com"))
        return proxy;
    if (shExpMatch(host, "loginios.jianniang.com") || newOption.headers.host == "loginios.jr.moefantasy.com")
        return proxy;
    return "DIRECT";
}