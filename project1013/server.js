/* http 웹서버 구축하기 */
var http = require("http");     // 필요한 모듈 가져오기
var fs = require("fs");
var url = require("url");

var mysql = require("mysql");   // (8) 외부모듈이기 떄문에,npm install로 설치해야댐
var con;        // (8) 접속 정보를 가진 객체(이 객체를 이용하여 쿼리문 사용)

var server = http.createServer(function(request,response){
    // 공통으로 사용하게 할려고 위에 올려버림
    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});

    // (4) 클라이언트의 요청내용이 다양하므로 , 각 요청을 처리할 조건문이 있어야 한다.
    //      따라서 원하는 것이 무엇인지 부터 파악해야 한다.
    //console.log("클라이언트의 요청 rul",request.url);       // 전체주소
    
    // (5) 전체 url 중에서도 url만을 추출해보자
    //     따라서 전체 .url을 해석해야한다. 해석은 parsing한다고 한다.
    var result = url.parse(request.url,true);
    //console.log("파싱결과보고서:",result);      // 파싱한 결과를 확인해 보자.(json으로 결과가 나온다.)
    
   //(7) 파싱시, true 옵션을 주면, 파라미터의 매개변수를 접근할 수 있는 
   //    json을 추가해준다. =  전체 json이 보유하고 있는 것 중에 query라는 것을 받아오자
   var paramObj = result.query;     //파라미터
   //console.log("id:",paramObj.m_name,"pass:",paramObj.m_pass) ;

   if(result.pathname=="/login"){
        //console.log("mysql 연동하여 회원 존재여부 확인할께요.");
        //response.end("mysql 연동할게요");   // 해당 처리를 안하면 무한대기에 빠진다.
        // (6,7) mysql 연동하여 select~문
        var sql = "select * from hclass where id='"+paramObj.m_name+"'and pass='"+paramObj.m_pass+"' ";
        console.log("sql:",sql);

        con.query(sql,function(error,record,fields){
            if(error){
                console.log("쿼리실행 실패",error);
            }else{
                console.log("records:",record);

                if(record.length>0){
                // (9) 레코드가 있을 때는(배열의 길이가 1), 로그인 성공 메시지
                    // console.log("인증성공");
                    response.end("<script>alert('인증성공');</script>");
                }else{
                // (9) 레코드가 없을 때는(배열의 길이가 0), 로그인 실패 메시지
                // history는 뒤로가는 역할.
                response.end("<script>alert('인증실패');history.back();</script>");
                }
            }
        });    // (8) 쿼리 실행

    }else if(result.pathname=="/apple"){
        console.log("사과를 드릴께요");
        response.end("사과를 드릴께요");
    }else if(result.pathname=="/loginForm"){
        // (2) 우리가 제작한 loginForm.html은 로컬 파일로 열면 안되고,
        //      모든 클라이언트가 인터넷 상의 주소로 접근하게 하기 위해서
        //      서버가 html 내용을 읽고, 그 내용을 클라이언트에게 응답정보로 보내야 한다.
        fs.readFile("./loginForm.html","utf-8",function(error,data){
            if(error){
                console.log("읽기 실패 입니다.",error);
            }else{
                // (3) 설정정보 입력★★★
                //      HTTP 프로토콜로 데이터를 주고 받을때는 이미 정해진 규약이 있으므로
                //      눈에 보이지 않는 수많은 설정 정보값들을 서버와 클라이언트간 교환한다.
                // response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                // 읽기 성공 -> 응답정보로 보내자
                // (1)클라이언트의 요청에 대한 응답처리..(html 문서를 주고받음)
                response.end(data);     // 컨텐츠전송 .end()는 마지막 발송문자
            }
        });
    }
    request.url.toUpperCase();
});   // 서버 객체 생성

// 서버를 완료 했으면 db에 넣어라. 보이게 만들기
function connectDB(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}
server.listen(8888,function(){
    console.log("Server is running at 8888 port...");
    // (8) 웹서버가 가동되면, mysql을 접속해놓자.
    connectDB();
});        // 서버가동
