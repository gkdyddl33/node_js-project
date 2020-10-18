var http = require("http");
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");
var ejs = require("ejs");
var qs = require("querystring"); 
let con;
var urlJson;

var server = http.createServer(function(request, response){
    //요청 구분 
    urlJson = url.parse(request.url, true);
    //console.log("urlJson : ", urlJson);

    if(urlJson.pathname=="/"){//메인을 요청하면..
        fs.readFile("./index.html","utf-8", function(error, data){
            if(error){
                console.log("index.html 읽기실패", error);
            }else{
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        })
    }else if(urlJson.pathname=="/member/registForm"){//가입폼을  요청하면...
        registForm(request, response);
    }else if(urlJson.pathname=="/member/regist"){//가입을 요청하면..
        regist(request, response);
    }else if(urlJson.pathname=="/member/loginForm"){//로그인 폼을 요청하면..

    }else if(urlJson.pathname=="/member/list"){//회원 목록을 요청하면..
        getList(request, response);
    }else if(urlJson.pathname=="/member/detail"){//회원 정보 보기를 요청하면..
        getDetail(request, response);
    }else if(urlJson.pathname=="/member/del"){//회원 정보 보기를 요청하면..
        del(request, response);
    }else if(urlJson.pathname=="/member/edit"){//회원 정보 수정을 요청하면..
        update(request, response);
    }else if(urlJson.pathname=="/category"){//동물구분을 요청하면..
        getCategory(request, response);
    }
    

});

//데이터 베이스 연동인 경우엔 함수로 별도로 정의 
function registForm(request, response){
    //회원가입폼은 디자인을 표현하기 위한 파일이므로, 기존에는 html로 충분했으나...
    //보유기술은 DB의 데이터를 가져와서 반영해야 하므로, ejs 로 처리해야 한다...
    var sql="select * from skill";
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("skill 조회실패", error);
        }else{
            console.log("skill record : ", record);
            //registForm.ejs에게 json배열을 전달하자
            fs.readFile("./registForm.ejs","utf-8", function(error, data){
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(ejs.render(data, {
                    skillArray:record
                }));
            });
        }
    });

}

//회원등록 처리 
function regist(request, response){
    //post방식으로 전송된, 파라미터받기!! 
    request.on("data", function(param){
        //url모듈에게 파싱을 처리하게 하지 말고, querystring 모듈로 처리한다 
        //console.log("post param :", new String(param).toString());
        var postParam = qs.parse(new String(param).toString());
        console.log("postParam : ", postParam);

        var sql="insert into member2(uid,password,uname,phone,email,addr,memo)";
        sql+=" values(?,?,?,?,?,?,?)"; //물음표를 바인드 변수라 한다

        con.query(sql,[ 
               postParam.uid,
               postParam.password,
               postParam.uname,
               postParam.phone,
               postParam.email,
               postParam.addr,
               postParam.memo
            ], function(error, fields){
                if(error){
                    console.log("등록실패",error);
                }else{
                    //목록페이지 보여주기
                    //등록되었음을 alert()으로 알려주고, /member/list 로 재접속 
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    var tag="<script>";
                    tag+="alert('등록성공');";
                    tag+="location.href='/member/list';"; // <a> 태그와 동일한 효과
                    tag+="</script>";

                    response.end(tag);   
                }
        } );
    });
}

//회원목록 처리함수 
function getList(request, response){
    // 회원 목록 가져오기
    var sql = "select * from member2";
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("조회 실패", error);
        } else {
            fs.readFile("./list.ejs", "utf-8", function(error, data){
                if(error){
                    console.log("list.ejs 읽기실패", error);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        memberArray: record
                    }));            
                }
            });
        }
    });
}

function getDetail(request,response){
    // console.log("urlJson : ", urlJson.query);
    var member2_id = urlJson.query.member2_id;
    var sql = "select * from member2 where member2_id="+member2_id;
    //var sql = "select * from member2 where member2_id =?";
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("한건 조회 실패", error);
        }else{
            fs.readFile("./detail.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("detail.ejs 읽기실패", err);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        member:record[0]
                    }));
                }
            });
        }
    });
    

}

//회원 1명 삭제 
function del(request, response){
    //get방식으로 전달된 파라미터 받기
    var member2_id = urlJson.query.member2_id;
    var sql="delete from member2 where member2_id="+member2_id;

    //error, fields : DML(insert, update ,delete :조작)
    //error, record, fields : select
    con.query(sql,function(error, fields ){
        if(error){
            console.log("삭제 실패", error);
        }else{
            //alert 띄우고, 회원 목록 보여주기 
            response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
            var tag="<script>";
            tag+="alert('탈퇴처리되었습니다');";
            tag+="location.href='/member/list';";
            tag+="</script>";
            response.end(tag);

        }     
    });

}

//회원정보 수정 처리
function update(request, response){
    //post로 전송된 파라미터들을 받자!!
    request.on("data", function(param){
        var postParam=qs.parse(new String(param).toString());
        
        //검증용
        //var sql="update member2 set phone='"+postParam.phone+"', email='"+postParam.email+"', addr='"+postParam.addr+"',memo='"+postParam.memo+"'";
        //sql+=", password='"+postParam.paassword+"', receive='"+postParam.receive+"' where member2_id="+postParam.member2_id;
        
        var sql="update member2 set phone=?, email=?, addr=?,memo=?";
        sql+=", password=?, receive=? where member2_id=?";

        con.query(sql,[ 
                postParam.phone,
                postParam.email,
                postParam.addr,
                postParam.memo,
                postParam.password,
                postParam.receive,
                postParam.member2_id
            ], function(error, fields){
                if(error){
                    console.log("수정실패",error);
                }else{
                    //alert 띄우고, 회원 목록 보여주기 
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    var tag="<script>";
                    tag+="alert('수정되었습니다');";
                    tag+="location.href='/member/detail?member2_id="+postParam.member2_id+"';";
                    tag+="</script>";
                    response.end(tag);
                }
        } );
    });
}

//동물의 종류 가져오기 
function getCategory(request, response){
    var sql="select * from category";

    con.query(sql, function(error, record, fields){
        if(error){
            console.log("동물구분 목록 조회실패", error);
        }else{
            fs.readFile("./animal.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("animal.ejs 읽기 실패", err);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        categoryArray:record
                    }));
                }           
            });
        }
    });
}

//mysql 접속 
function connect(){
    con=mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}

server.listen(7788, function(){
    console.log("Server is running at 7788 port...");
    connect();
});