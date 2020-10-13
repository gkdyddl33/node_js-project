var http = require("http");
var fs = require("fs");
var url = require("url");
var mysql = require("mysql");
var con;

var server = http.createServer(function(request,response){

    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    // (2) 원하는 요청이 무엇인지 파악 = request.url/전체주소
    // console.log("클라이언트의 요청 url ",request.url);
    var result = url.parse(request.url); // json으로 전송
    // console.log("파싱결과보고서:",result);

    var paramObj = result.query;    // paramObj.m_name..

    if(result.pathname=="/login"){
        // console.log("mysql 연동하여 회원 존재여부 확인할께요.");
        // mysql실행
        var sql = "select * from hclass where id='"+paramObj.m_name+"'and pass='"+paramObj.m_pass+"'";
        // console.log("sql:",sql);
        con.query(sql,function(error,record,fields){
            if(error){
                console.log("쿼리실행 실패",error);
            }else{
                console.log("records:",record);
                if(record.length>0){
                    response.end("<script>alert('인증성공');</script>");
                }else{
                    response.end("<script>alert('인증실패');history.back();</script>");
                }
            }
        });
    }else if(result.pathname=="/apple"){
        response.end("사과를 드릴게요");
    }else if(result.pathname=="/loginForm"){
        // (1) 내가 만든 파일을 읽어와야 한다. = 그 내용을 응답정보로 보내야 한다.
        fs.readFile("./loginForm.html","utf-8",function(error,data){
            if(error){
                console.log("읽기 실패",error);
            }else{
                response.end(data);
            }
        });
    }
    request.url.toUpperCase();
});
function connectDB(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}
server.listen(9999,function(){
    console.log("Server is running at 9999 port..");
    connectDB();
});