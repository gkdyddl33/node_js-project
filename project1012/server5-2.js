/* 클라이언트가 전송한 파라미터 값들을 mysql에 넣어보자. */

var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function(request,response){
    // 서버에 접근 = 접속사 발견 = 클라이언트
    fs.readFile("./회원폼유효성체크2.html","utf-8",function(error,data){
        if(error){
            console.log("실패",error);
        }else{
            response.writeHead(200,{"Content-Type":"text.html;charset=utf-8"});
            response.end(data);
        }
    });
});

server.listen(7979,function(){
    console.log("Server is running at 7979 port..");
})