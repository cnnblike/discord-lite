function FindProxyForURL(url, host)
{
    proxy = "PROXY discord.cnnblike.com:80";
    if (shExpMatch(url, "\/index\.php\/(\d{4}?)\/Index\/index") && shExpMatch(host,"*.ppgame.com"))
        return proxy;
    return "DIRECT";
}
