var http = require("http");
var url = require("url");
var mysql = require("mysql");
var con;
var fs = require("fs");
var qs = require("querystring");

var server = http.createServer(function(request,response){
    var urlJson = url.parse(request.url,true);

    if(urlJson.pathname=="/"){

    }else if(urlJson.pathname=="/member/registForm"){
        // (3) 회원폼을 요청
        registForm(request,response);
    }else if(urlJson.pathname=="/member/regist"){
        // (4) 회원가입을 요청
        regist(request,response);
    }else if(urlJson.pathname=="/member/loginForm"){
        // 로그인 폼을 요청
    }else if(urlJson.pathname=="/member/list"){
        // (5) 회원목록을 요청
        getList(request,response);
    }else if(urlJson.pathname=="/member/detail"){
        // (6) 회원 정보 상세보기를 요청
        getDetail(request,response);
    }else if(urlJson.pathname=="/member/del"){
        // (7) 회원 탈퇴 -> detail.ejs 먼저 수정
        del(request,response);
    }else if(urlJson.pathname=="/member/edit"){
        // (8) 정보 수정 -> detail.ejs 먼저 수정
        update(request,response);
    }
});
function registForm(request,response){
    // 회원폼에는 보유기술 유효성체크가 있음 -> 1개 이상은 적어도 체크가 되야 가입되게
    var sql = "select * from skill";
    con.query(sql,function(error,record,fields){
        if(error){
            console.log("skill 조회실패");
        }else{
            // 성공했니? 그럼 회원폼 파일을 가져와야지..
            fs.readFile("./registForm.ejs","utf-8",function(error,data){
                if(error){
                    console.log("ejs 읽기 실패",error);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        skillArray:record
                    }));
                }
            });
        }
    });
}
function regist(request,response){
    // get 방식 -> url.parse, post 방식 -> queryString.parse
    request.on("data",function(param){
        var postParam = qs.parse(new String(param).toString());

        var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
        sql += " values(?,?,?,?,?,?,?,?)";
        // 가입명부
        con.query(sql,[
            postParam.uid,
            postParam.password,
            postParam.uname,
            postParam.phone,
            postParam.email,            
            postParam.receive,            
            postParam.addr,
            postParam.memo       
        ],function(error,fiedls){
            if(error){
                console.log("등록실패",error);
            }else{
                // 가입명부를 다 넣엇니? 그럼 목록을 보여줘 = list.ejs
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                var tag = "<script>";
                tag += "alert('등록성공')";
                tag += "location.href='/member/list'";
                tag += "</script>";
                response.end();
            }
        });
    });
}
function getList(request,response){
    var sql = "select * from member2";
    con.query(sql,function(error,record,fields){
        if(error){
            console.log("조회실패",error);
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(ejs.render(data,{
                memberArray:record
            }));
        }
    });
}
function getDetail(request,response){
    // 상세보기 -> 회원이 작성한 가입 명부 목록이 잘 넘어왓나? 를 알아봐야됨
    var member2_id = urlJson.query.member2_id;
    var sql = "select * from member2 where member2_id="+member2_id;

    con.query(sql,function(error,fields){
        if(error){
            console.log("한건 조회실패",error);            
        }else{
            fs.readFile("./detail.ejs","utf-8",function(err,data){
                if(err){
                    console.log("detail.ejs 읽기 실패",err);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        member:record[0]
                    }));
                }
            });
        }
    });
}
function del(request,response){
    var member2_id = urlJson.query.member2_id;
    var sql = "delete from member2 where member2_id="+member2_id;

    con.query(sql,function(error,data){
        if(error){
            console.log("삭제실패",error);
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            var tag = "<script>";
            tag += "alert('탈퇴처리 완료되었습니다.')";
            tag += "location.href='/member/list'";
            tag += "</script>";
            response.end(tag);
        }
    });
}
function updata(request,response){
    var postParam = qs.parse(new String(param).toString());

    var sql = "update member2 set phone=?, email=?, addr=?, memo=?";
    sql += ", password=?, receive=? where member2_id=?";

    con.query(sql,[
        postParam.phone,
        postParam.email,
        postParam.addr,
        postParam.memo,
        postParam.password,
        postParam.receive,
        postParam.member2_id
    ],function(error,fields){
       if(error){
           console.log("수정실패",error);
       }else{
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        var tag = "<script>";
        tag += "alert('수정되었습니다.')";
        tag += "location.href='/member/detail?member2_id="+postParam.member2_id+"';";
        tag += "</script>";
        response.end(tag);
       }
    });
}
function connect(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}
server.listen(7788,function(){
    console.log("Server is running at 7788 port..");
    connect();
});