(function() {

    _fmOpt = {

        partner: 'jbhl',

        appName: 'jbhl_jpfq',

        token: 'jbhl' + "-" + new Date().getTime() + "-"+ Math.random().toString(16).substr(2),

        fmb: true,

        success: function(data) {
            //alert(111);
            // 在成功完成采集后，success回调中可以获取到blackbox
            //console.log('blackbox: ', data)
            window.blackbox=data;
            window.localStorage.setItem('blackbox', data)
            // let blackbox = data
            // return blackbox
            //alert(blackbox);
        },

        fpHost: 'https://fptest.fraudmetrix.cn',

        staticHost: 'statictest.fraudmetrix.cn',

        tcpHost: 'fpflashtest.fraudmetrix.cn',

        wsHost: 'fptest.fraudmetrix.cn:9090',

    };

    var cimg = new Image(1,1);

    cimg.onload = function() {

        _fmOpt.imgLoaded = true;

    };

    cimg.src = "https://fptest.fraudmetrix.cn/fp/clear.png?partnerCode=jbhl&appName=jbhl_jpfq&tokenId=" + _fmOpt.token;

    var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true;

    fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.fraudmetrix.cn/v3/fm.js?ver=0.1&t=' + (new Date().getTime()/3600000).toFixed(0);

    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);

})();
