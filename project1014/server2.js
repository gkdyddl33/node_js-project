/* 
    Get / Post 전송을 이해하기 위한 서버

    Get : 얻어오다, 가져오다(서버로부터 컨텐츠를 가져올 때 사용되는 요청 방식)
            html <a> 링크가 바로 get 방식의 요청이다.
            GET 방식으로 데이터. 즉, 파라미터를 전송하게 되면, 데이터가 노출되버린다.
            
            왜? HTTP 프로토콜의 헤어데 실어 나르므로..(=편지봉투에 작성)
                 또한 편지봉투에 데이터를 전송하면 편지지에 비해 전송할 수 있는 데이터량에
                 한계가 있다.

            주용도? 뉴스기사 등(다른 URL)의 링크를 통해 파라미터 전송할 때 주로 사용..     

    POST    : 보내다는 의미(클라이언트 서버에 데이터를 전송할 때 사용하는 방식)
                  HTTP 프로토콜의 body를 통해 데이터를 전소하기 떄문에 편지지에 데이터를 
                  실어서 보내는 것과 같다.
                  봉투 안에 담아서 보내기 때문에 데이터가 노출되지 않는다.
                  
                  특징? 보낼 수 있는 데이터량에 한계가 없다.

                  용도? 노출되면 위험한 데이터를 전송시 사용
                           (로그인요청, 회원가입 등..)
                           파일(사진,동영상 등)등을 서버에 전송시 사용한다.  
                  post 의 방식은 form 태그를 이용해서 요청할 수 있다*                                                                    
*/
var http = require("http");
var url = require("url");
var querystring = require("querystring");
// get, post까지 파싱이 가능한 모듈

var server = http.createServer(function(request,response){
    // console.log("클라이언트의 요청 방식: ",request.method);
    if(request.method=="GET"){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end("클라이언트가 GET방식으로 요청했네요");

        // get방식으로 전달된 파라미터 받기
        var urlJson = url.parse(request.url,true);
        // console.log("Get URL분석결과 : ",urlJson);

        var paramJson = urlJson.query;      // id,pass 담겨있다.
        console.log("ID: ",paramJson.id);
        console.log("Pass: ",paramJson.pass);

    }else if(request.method=="POST"){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end("클라이언트가 POST방식으로 요청했네요");

        // body로 전송된 데이터는 url 데이터로는 해결이 안된다.
        // ==> post 방식으로 전달된 데이터를 받기 위한 이벤트를 감지해보자.
        request.on("data",function(param){
            // Stirng 표현**
            // var str = "korea";      
            // var str2 = new String("korea");
            
            var postParam = querystring.parse(new String(param).toString());
            console.log("Post 전송된 파라미터는 : ",postParam);

            // var urlJson = querystring.parse(request.url,true);
            // console.log("Post 전송된 파라미터는 : ",new String(param)); // 문자로 바꿔보자.
        });
    }
});

server.listen(9999,function(){
    console.log("My Server is running at 9999 port...");
});