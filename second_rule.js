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
	if (req.requestOptions.hostname == "version.jr.moefantasy.com" || req.requestOptions.hostname.indexOf("ppgame.com")!=-1 ){
	    var newOption = Object.assign({},req.requestOptions);
            if (req.requestOptions.hostname == "version.jr.moefantasy.com"){
	    	newOption.path = newOption.path.replace("100020", "100021").replace("100020","100021");
		//console.log(newOption);
	    }
	    return {
		requestOptions: newOption
	    }
	}
        if (req.protocol == 'https') {
            // intercept every https request to prevent potentional mallicious abuse.
            return badResponse
        }
        return badResponse
    },
    *beforeSendResponse (req, res) {
	var newResponse = Object.assign({}, res.response);
	if (req.requestOptions.hostname == "version.jr.moefantasy.com" && req.requestOptions.path.indexOf("index/checkVer")!=-1){
	    newResponse.body = Buffer.from(newResponse.body.toString().replace("\"cheatsCheck\":0", "\"cheatsCheck\":1").replace("\"shipRenameCheck\":0", "\"shipRenameCheck\":1"));
	}
	if (req.requestOptions.hostname.indexOf("ppgame.com")!=-1){
	    newResponse.body = Buffer.from(newResponse.body.toString().replace(/\"naive_build_gun_formula\":\"((\d+):(\d+):(\d+):(\d+))?\"/, "\"naive_build_gun_formula\":\"33:33:33:33\""));
	}
	return {
	    response:newResponse
	}
    }
};

