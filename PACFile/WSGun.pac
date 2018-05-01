function FindProxyForURL(url, host)
{
    proxy = "PROXY 10.0.0.39:9090";
    if (shExpMatch(host, "version.jr.moefantasy.com"))
        return proxy;
    if (shExpMatch(host,"version.channel.jr.moefantasy.com"))
	    return proxy;
    return "DIRECT";
}
