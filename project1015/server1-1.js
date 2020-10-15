var http = require("http");
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");
var con;
var qs = require("querystring");


var server = http.createServer(function(request,response){
    var urlJson = url.parse(request.url,true);

    // 사용자가 요청한 것을 구분하기 = pathname = 구분 후 파일 불러오기
    if(urlJson.pathname=="/"){ // ==> 메인
        fs.readFile("./index.html","utf-8",function(error,data){
            if(error){
                console.log("index.html 읽기실패",error);
            }else{
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/registForm1-1"){ // ==> 회원폼(회원가입)
        registForm(request,response);
    }else if(urlJson.pathname=="/member/regist"){ // ==> 회원가입 즉, 등록
        regist(request,response);
    }else if(urlJson.pathname=="/member/loginForm"){// ==> 로그인 폼
        
    }else if(urlJson.pathname=="/member/list"){ // ==> 회원 목록
        getList(request,response);
    }else if(urlJson.pathname=="/member/detail"){ // ==> 회원정보상세보기
        getDetail(request,response);
    }else if(urlJson.pathname=="/member/del"){
        del(request,response);
    }else if(urlJson.pathname=="/member/edit"){
        update(request,response);
    }
});
function registForm(request,response){
    var sql = "select * from skill";

    con.query(sql,function(error,record,fields){
        if(error){
            console.log("skill 조회실패",error);
        }else{// 회원가입 폼을 불러와야 한다 = 성공 + 보유기술 유효성체크
            console.log("skill record: ",record);
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
function regist(request,response){ // 회원등록 처리 = post방식 
    // 파라미터 = queryString
    request.on("data",function(param){
        var postParam = qs.parse(new String(param).toString());

        // db 연동 => db 추가
        var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
        sql += " values(?,?,?,?,?,?,?,?)";

        con.query(sql,[
            postParam.uid,
            postParam.password,
            postParam.uname,
            postParam.phone,
            postParam.email,            
            postParam.receive,            
            postParam.addr,
            postParam.memo     
        ],function(error,fields){
            if(error){
                console.log("등록실패",error);
            }else{
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                // 성공? 그럼 목록페이지를 보여주자 = list.ejs
                var tag = "<script>";
                tag += "alert('등록성공')";s
                tag += "location.href='member/list';";  // 목록테이블 list.ejs 생성
                tag += "</script>";
                response.end(tag);
            }
        });
    });
}
function getList(request,response){
    // 회원가입 폼에 회원가입을 등록한다 그 다음 -> 회원목록을 볼 수 있게 해주자.
    // list.ejs
    var sql = "select * from member2";
    con.query(sql,function(error,record,fields){
        if(error){
            console.log("조회 실패",error);            
        }else{
            // 회원 등록에 성공하면 목록테이블로 가게 끔 재접속 을 해놓음
            fs.readFile("./list.ejs","utf-8",function(error,data){
                if(error){
                    console.log("list.ejs 읽기실패",error);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        memberArray:record
                    }));
                }
            });
        }
    });
}
function getDetail(request,response){
    // 회원번호를 누르면 상세정보가 출력되게 작성
    var member2_id = urlJson.query.member2_id;
    var sql = "select * from member2 where member2_id="+member2_id;

    con.query(sql,function(error,record,fields){
        if(error){
            console.log("한건 조회 실패",error);
        }else{
            fs.readFile("./detail.ejs","utf-8",function(err,data){
                if(err){
                    console.log("detail.ejs 읽기실패",err);
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

    con.query(sql,function(error,fields){
        if(error){
            console.log("삭제 실패",error);
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            var tag = "<script>";
            tag += "alert('탈퇴처리 완료되었습니다.');";
            tag += "location.href='/member/list';";
            tag += "</script>";
            response.end(tag);
        }
    });
}

function update(request,response){
    // 파라미터를 받자
    request.on("data",function(param){
        var postParam = qs.parse(new String(param).toString());

        var sql = "update member2 set phone=?, email=?, addr=?, memo=?";
        sql += ", password=?, receive=? where member2_id=?";
        // 회원번호가 ? 인 것을 수정해줘

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
                tag += "alert('수정되었습니다.');";
                tag += "location.href='/member/detail?member2_id="+postParam.member2_id+"';";
                tag += "</script>";
                response.end(tag);
            }
        });
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
    console.log("Server is running at 7788 port...");
    connect();
});