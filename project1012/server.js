/* 
    HTTP 모듈을 이용하면, 단 몇줄만으로도 웹서버를 구출할 수 있다.
*/
var http = require("http"); // 모듈가져오기

var server = http.createServer();    // http 모듈안에서 지원하는 서버 객체 생성

// 접속자가 들어오는지 확인 해본다 = ex.http://192.168.219.102:8989/
server.on("connection",function(){
    console.log("접속자 발견");
});

server.listen(8989,function(){
    console.log("My Server is running at 8989...");
});        // 서버 가동(포트번호)
