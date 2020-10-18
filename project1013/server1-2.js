var http = require("http");
var url = require("url");
var mysql = require("mysql");
var con;
var fs = require("fs");

var server = http.createServer(function(request,response){
    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});

    var urlJson = url.parse(request.url,true);
    var paramObj = urlJson.query;

    if(urlJson.pathname=="/login"){
        var sql = "select * from hclass where id='"+paramObj.m_name+"' and pass='"+paramObj.m_pass+"'";

        con.query(sql,function(error,record,fields){
            if(error){
                console.log("쿼리실행 실패",error);
            }else{
                if(record.length>0){
                    response.end("<script>alert('인증성공');</script>");
                }else{
                    response.end("<script>alert('인증실패');</script>");
                }
            }
        });
    }else if(urlJson.pathname=="/apple"){
        response.end("사과를 드릴께요");
    }else if(urlJson.pathname=="/loginForm"){
        fs.readFile("./loginForm.html","utf-8",function(error,data){
            if(error){
                console.log("읽기 실패입니다.",error);
            }else{
                response.end(data);
            }
        });
    }
    request.url.toUpperCase();
});

function connectDB(){
    con = mysql.createConnection({
        url:'localhost',
        user:"root",
        password:"1234",
        database:"node"
    });
}
server.listen(8888,function(){
    console.log("Server is running at 8888 port..");
    connectDB();
});