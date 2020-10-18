// 서버만드는 법..
var http = require("http");
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");
var ejs = require("ejs");
var qs = require("querystring");
let con;
var urlJson;

var server = http.createServer(function(request,response){
    // (1)사용자가 요청한 것을 구분하기
    urlJson = url.parse(request.url,true);   
    if(urlJson.pathname=="/"){
        // 메인을 요청
        fs.readFile("./index.html","utf-8",function(error,data){
            if(error){
                console.log("index.html 읽기실패",error);
            }else{
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        });
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
    }else if(urlJson.pathname=="/category"){
        // ** 새로운 동물 카테고리
        getCategory(request,response);
    }else if(urlJson.pathname=="/animal"){
        // ** 새로운 카테고리에 소속된 동물
        getAnimal(request,response);
    }
});

// (2) 데이터 베이스 DB 연동인 경우엔 함수로 별도정의★★★
function registForm(request,response){// 객체를 찾을 수 있게 매개변수로 받자
    // (3)
    // 회원가입 폼은 디자인을 표현하기 위한 파일이므로, 기존에는 html로 충분했으나
    // 보유기술은 DB(sql)의 데이터를 가져와서 반영해야 하므로, ejs로 처리해야 한다.
    var sql = "select * from skill";
    con.query(sql,function(error,record,fields){// 담겨있는 외부모듈 con에 query 질의할게
                                                                  // sql문을 넣엇어 읽어봐 그리고 익명함수 실행해줘
        if(error){
            console.log("skill 조회실패");
        }else{
            console.log("skill record: ",record);
            fs.readFile("./registForm.ejs","utf-8",function(error,data){// ejs로 가기 전에 읽는게 '우선'
                if(error){
                    console.log("ejs 읽기 실패",error);
                }else{
                    // registForm.ejs에게 json배열을 전달하자 = 보유기술
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        // data를 보낼건데 skill이라는 변수에 record를 담아서 줄게
                        // 원본 노출을 막기 위해 render링 하는 것.
                        skillArray:record
                    }));
                }
            });
        }
    });
}

function regist(request,response){
    // (4) 회원등록 처리 = POST방식 = 노출가리기
    // post 방식으로 전송된 파라미터 받기 ex. regist? _____
    request.on("data",function(param){
        // url 모듈에게 파싱을 처리하게 하지말고, queryString모듈로 처리한다.
        // console.log("post param: ",new String(param).toString());
        var postParam = qs.parse(new String(param).toString());
        console.log("postParam: ",postParam);
    
        var sql ="insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
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
                // 목록페이지 보여주기 = list.ejs
                // 등록되었음을 alert()으로 알려주고, /member/list로 재접속
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                var tag = "<script>";
                tag += "alert('등록성공')";
                tag += "location.href='/member/list';"; // 회원이 적혀잇는 목록리스트
                tag += "</script>";
                response.end(tag);                
            }
        });
    });
}
function getList(request,response){
    // (5-1) 회원목록 가져오기
    var sql = "select * from member2";
    con.query(sql,function(error,record,fields){
        if(error){
            console.log("조회 실패",error);
        }else{
            // (5) 회원목록 = 회원등록에서 재접속 한 리스트 목록
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
    // (6) 회원 상세보기
    console.log("urlJson",urlJson);     // (6) 출력 확인 파라미터 넘어오는 것

    var member2_id =  urlJson.query.member2_id;
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
                    response.end(ejs.render(data, {
                        // detail.ejs에서 member로 값이 기다리고 있음
                        member:record[0]       
                    }));
                }
            });        
        }        
    });
}

// (7) 회원 한명 삭제,탈퇴
function del(request,response){
    // (7-2) get 방식으로 전달된 파라미터 받기
    var member2_id = urlJson.query.member2_id;

    var sql = "delete from member2 where member2_id="+member2_id;

    // error, fields : DML(insert, update, delete)
    // error, record, fields : select
    con.query(sql,function(error,fields){
        if(error){
            console.log("삭제 실패",error);            
        }else{
            // alert띄우고 회원 목록 보여주기
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            var tag = "<script>";
            tag += "alert('탈퇴처리 완료되었습니다.');";
            tag += "location.href='/member/list';";
            tag += "</script>";
            response.end(tag);
        }
    });
}
// (8) 회원 정보 수정 처리
function update(request,response){
    // (8-2) post로 전송된 파라미터들을 받자!
    request.on("data",function(param){
        var postParam = qs.parse(new String(param).toString());

        // 검증용
        // var sql = "update member2 set phone='"+postParam.phone+"', email='"+postParam.email+"', addr='"+postParam.addr+"', memo='"+postParam.memo+"'";
        // sql += ", password='"+postParam.password+"', receive='"+postParam.receive+"' where member2_id="+postParam.member2_id;
        
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
                tag += "alert('수정되었습니다.');";
                tag += "location.href='/member/detail?member2_id="+postParam.member2_id+"';";
                tag += "</script>";
                response.end(tag);
            }
        });        
    });  
}

// ** 동물의 종류 가져오기
function getCategory(request,response){
    var sql = "select * from category";
    con.query(sql,function(error,record,fields){
        if(error){
            console.log("동물목록 조회 실패",error);
        }else{
            fs.readFile("./animal.ejs","utf-8",function(err,data){
                if(err){
                    console.log("동물구분 목록 읽기 실패",error);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        categoryArray:record
                    }));
                }
            });
        }
    });
}
// ** 공통되는 부분을 재사용하기 위해 만든 함수 = 카테고리 목록
// 비동기와 동기화 배우고 써먹자.!
// function getCategoryList(){
//     var categoryArray=[];   // 빈 배열 선언

//     var sql = "select * from category";
//     con.query(sql,function(error,record,fields){
//         if(error){
//             console.log("동물목록 가져오기 실패",error);
//         }else{
//             categoryArray = record;     // sql 실행이 되면서 생기는 배열을
//                                                     // 새로 생성한 변수에 담는다.
//         }
//     });
// }

// ** 동물의 목록 가져오기
function getAnimal(request,response){
    // 자식 + 부모를 보이기 위해 카데고리 가져오기
    var sql = "select * from category";
    con.query(sql,function(error,record,fields){// sql문 실행
        if(error){
            console.log("동물목록 조회 실패",error);
        }else{  // ==> "비동기 방식 -> 실행하는데 순서가 없다. "   
            // GET 방식
            var categoryRecord=record;       // * 카테고리 목록 배열

            category_id = urlJson.query.category_id;
            var sql = "select * from animal where category_id="+category_id;
        
            // mysql 연동
            con.query(sql,function(error,record,fields){
                if(error){
                    console.log("동물목록 가져오기 실패",error);
                }else{
                    console.log("record: ",record);     // 배열인지 아닌지 확인해보는 코드
                    fs.readFile("./animail.ejs","utf-8",function(err,data){
                        if(err){
                            console.log("animal.ejs 읽기 실패",error);
                        }else{
                            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});                    
                            response.end(ejs.render(data,{
                                animalArray:record,
                                // 자식의 동물이름이 부모가 선택하면 나오는데
                                // 부모도 계속 유지를 해야 하기 때문에 같이 응답해준다.                        
                                categoryArray:categoryRecord,
                                category_id:category_id
                            }));
                        }
                    });
                }
            });                   
        }
    });
   
}
// (3) mysql 접속
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