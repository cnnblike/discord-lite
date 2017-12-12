function FindProxyForURL(url, host)
{
    proxy = "PROXY discord.cnnblike.com:81";
    if (shExpMatch(host, "version.jr.moefantasy.com"))
        return proxy;
    return "DIRECT";
}
