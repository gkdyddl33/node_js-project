var http = require("http");
var url = require("url");
var fs = require("fs");     // 내장
var mysql = require("mysql");       // 외부=사용자가입력
var con;

var server = http.createServer(function(request,response){
    // 서버와 클라이언트와의 관계 = 요청,응답
    // 그러기 위해서는?
    // 클라이언트가 원하는 것이 무엇인지를 구분하기 위한 url분석
    var parseObj = url.parse(request.url,true);
    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});

    // (1) 회원가입 양식디자인 폼
    if(parseObj.pathname=="/member/registForm"){
        // 클라이언트 요청을 url로 분석을 했으면 파일을 읽어오자.
        fs.readFile("./registForm.html","utf-8",function(error,data){
            if(error){
                console.log("읽기 실패",error);
            }else{
                response.end(data);
            }
        });
        //(2) 회원가입 
    }else if(parseObj.pathname=="/member/regist"){
        // mysql 외부 에서 받은 정보를 insert 할 예정 = 등록
        var param = parseObj.query;
        var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo";
        sql += "values(?,?,?,?,?,?,?,?)";

        con.query(sql,[param.uid,
            param.password,
            param.uname,
            param.phone,
            param.email_id,
            param.receive,
            param.addr,
            param.memo 
        ],function(error,result,fields){
            if(error){
                console.log("등록실패",error);
            }else{
                var msg = "<script>";
                msg +="alert('가입성공')";
                msg += "location.href='member.list';";
                msg+="</script>";
                response.end(msg);
            }
        });
        //(3) 회원 목록
    }else if(parseObj.pathname=="/member/list"){
        // mysql 외부에서 받은 것을 select할 예정
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

                // 계속 넣어야 하므로 반복문 사용
                console.log("select문의 결과 record: ",record);
                for(var i=0;i<record.length;i++){
                    var json = record[i];
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
        // (4) 회원탈퇴
    }else if(parseObj.pathname=="/member/del"){
        response.end("회원을 삭제합니다.");
        // (5) 회원 수정
    }else if(parseObj.pathname=="/member/edit"){
        response.end("회원정보를 수정합니다.");
    }

    
});

function connetDB(){
   con = mysql.createConnection({
    url:"localhost",
    user:"root",
    password:"1234",
    database:"node"
   });
}
server.listen(9000,function(){
    console.log("Web Server is running at port 9000...");
    connetDB();
});