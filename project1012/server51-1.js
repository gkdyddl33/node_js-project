var http = require("http");
var fs = fequire("fs");
// 웹 서버 구축
var server = http.createServer(function(request,response){
    // 클라이언트가 원하는게 무엇인지 구분 == 요청분석 == request
    console.log("클라이언트가 요청시 사용한 url ",request.url);

    fs.readFile("./회원폼유효성체크.html","utf-8",function(error,data){
        if(error){
            console.log("실패",error);            
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(data);
        }
    });
});
server.listen(7979,function(){
    console.log("Server is running at 7979 port..");
})