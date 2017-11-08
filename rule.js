module.exports = {
    summary: function(){
        return "WarShipGirl: Customed rule for switch from iOS server to Android."
    },
    *beforeSendRequest(requestDetail){
        const badResponse = {
            response: {
                statusCode: 200,
                header: { 'content-type': 'text/html' },
                body: " WarShipGirl: Customed rule for switch from iOS server to Android. \n Danger! All kind of MITM proxy is **DANGEROURS**! ONLY USE THE ONE YOU TRUST!"
            }
        }
        if (requestDetail.requestOptions.hostname == "proxy.cnnblike.com") {
            return badResponse
        }
        if (requestDetail.requestOptions.hostname == "loginios.jianniang.com" || newOption.headers.host == "loginios.jr.moefantasy.com"){
            var newOption = Object.assign({},requestDetail.requestOptions);
            newOption.hostname = "login.jr.moefantasy.com";
            newOption.headers.host = "login.jr.moefantasy.com";
            return {
                requestOptions: newOption
            };
        }
        if (requestDetail.protocol == 'https') {
            // intercept every https request to prevent potentional mallicious abuse.
            return badResponse
        }
        return null
    }
}