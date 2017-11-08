module.exports = {
    summary:
	"WarShipGirl: Customed rule for switch from iOS server to Android."
    ,
    *beforeSendRequest (req) {
	let badResponse = {
            response: {
                statusCode: 200,
                header: { 'content-type': 'text/html' },
                body: " WarShipGirl: Customed rule for switch from iOS server to Android. \n Danger! All kind of MITM proxy is **DANGEROURS**! ONLY USE THE ONE YOU TRUST!"
            }
        };
        if (req.requestOptions.hostname == "discord.cnnblike.com") {
            return badResponse;
        };
        if (req.requestOptions.hostname == "loginios.jianniang.com" || req.requestOptions.hostname == "loginios.jr.moefantasy.com"){
	    var newOption = Object.assign({},req.requestOptions);
            newOption.hostname = "login.jr.moefantasy.com";
            newOption.headers.Host = "login.jr.moefantasy.com";
	    console.log(req)
	    console.log(newOption)
            return {
                requestOptions: newOption
            };
        }
        if (req.protocol == 'https') {
            // intercept every https request to prevent potentional mallicious abuse.
            return badResponse
        }
        return badResponse
    },
};

