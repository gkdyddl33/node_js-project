var http = require("http");
var url = require("url");
var mysql = require("mysql");
var con;
var fs = require("fs");
const { resolve } = require("path");

var server = http.createServer(function(request,response){
    var parseObj = url.parse(request.url,true);

    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    if(parseObj.pathname=="/member/registForm"){
        fs.readFile("./registForm.html","utf-8",function(error,data){
            if(error){
                console.log("읽기 실패",error);
            }else{
                response.end(data);
            }
        });
    }else if(parseObj.pathname=="/member/regist"){
        // 회원가입 = 입력,삽입 insert = sql
        var param = parseObj.query;
        var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo";
        sql += "values(?,?,?,?,?,?,?,?)";

        con.query(sql,[
            param.uid, 
            param.password,
            param.uname,
            param.phone,
            param.email,
            param.receive,
            param.addr,
            param.memo 
        ],function(error,fields){
            if(error){
                console.log("등록실패",error);
            }else{
                var msg = "<script>";
                msg += "alert('가입성공')";
                msg += "location.href='/member/list';";
                msg += "</script>";
                response.end(msg);
            }
        });

    }else if(parseObj.pathname=="/member/list"){
        // 회원목록
        var sql = "select * from member2";
        con.query(sql,function(error,record,fields){
            if(error){
                console.log("가져오기 실패",error);
            }else{
                var tag = "<table border='1px' width='80%'>";
                tag += "<tr>";
                tag += "<td>member2_id</td>"
                tag += "<td>uid</td>"
                tag += "<td>password</td>"
                tag += "<td>uname</td>"
                tag += "<td>phone</td>"
                tag += "<td>email</td>"
                tag += "<td>receive</td>"
                tag += "<td>addr</td>"
                tag += "<td>memo</td>"
                tag += "</tr>";

                for(var i=0;i<record.length;i++){
                    var json = record[i];
                    var tag = "<table border='1px' width='80%'>";
                    tag += "<tr>";
                    tag += "<td>"+json.member2_id+"</td>"
                    tag += "<td>"+json.uid+"</td>"
                    tag += "<td>"+json.password+"</td>"
                    tag += "<td>"+json.uname+"</td>"
                    tag += "<td>"+json.phone+"</td>"
                    tag += "<td>"+json.email+"</td>"
                    tag += "<td>"+json.receive+"</td>"
                    tag += "<td>"+json.addr+"</td>"
                    tag += "<td>"+json.memo+"</td>"
                    tag += "</tr>";
                }
                tag += "</table>";
                response.end(tag);
            }
        });
    }else if(parseObj.pathname=="/member/del"){// 회원탈퇴를 원하면
        response.end("회원을 삭제합니다.");
    }else if(parseObj.pathname=="/member/edit"){// 회원수정을 원하면
        response.end("회원정보를 수정합니다.");
    }
});
function connectDB(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    })
}
server.listen(9999,function(){
    console.log("Web Server is running at port 9999...");
    connectDB();
});