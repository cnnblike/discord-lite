function FindProxyForURL(url, host)
{
    proxy = "PROXY discord.cnnblike.com:80";
    if (shExpMatch(host, "version.jr.moefantasy.com"))
        return proxy;
    if (shExpMatch(host,"version.channel.jr.moefantasy.com"))
	return proxy;
    return "DIRECT";
}
