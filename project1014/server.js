/* 웹서버 구축하기 */
var http = require("http");     // 내부모듈
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");          // 조건문에서 마지막으로 실행
// 외부(클라이언트)에서 회원가입을 하면 등록되게 외부 모듈을 가져온다
let conStr={
    // mysql에 들어갈 접속 문자열
    url:"localhost",
    user:"root",
    password:"1234",
    database:"node"
};
var con;    // 해방 객체로 sql 문을 수행할 수 있다(=접속정보를 가진 객체)
var ejs = require("ejs");       // node 서버에서만 실행가능한 문서 = .ejs
                                          // html로 채워졌다고하여 html문서로 보면 안됨

var server = http.createServer(function(request,response){
    var urlJson = url.parse(request.url,true);
    console.log("URL 분석 결과는 ",urlJson);

    if(urlJson.pathname=="/"){
        fs.readFile("./index.html","utf-8",function(error,data){
            if(error){
                console.log("index.html 읽기실패",error)
            }else{
                // 200이란? HTTP 
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/registForm"){
        fs.readFile("./registForm.html","utf-8",function(error,data){
            if(error){
                console.log("registForm.html 읽기실패",error);
            }else{
                // 200이란? HTTP 
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/loginForm"){
        fs.readFile("./loginForm.html","utf-8",function(error,data){
            if(error){
                console.log("loginForm.html 읽기실패",error)
            }else{
                // 200이란? HTTP 
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/regist"){
        // ★★★
        // 파라미터(매개변수)를 받는다.
        // -> get 방식의 파라미터 받기
        
        var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo";
        sql += " values(?,?,?,?,?,?,?,?)";
        var param = urlJson.query;

        con.query(sql, [param.uid,
            param.password,
            param.uname,
            param.phone,
            param.email,
            param.receive,
            param.addr, 
            param.memo
        ],function(error,result,fields){
            if(error){
                console.log("회원정보 insert 실패",error);
            }else{
                // values (회원번호,스킬번호) 을 구하는 법은?
                // 회원번호는?  member2_id가 외래키이므로 select 로 가져와야한다.
                // 그리고 회원번호도 보이게 만들어 주자 as...
                sql = "select last_insert_id() as member2_id";
                
                con.query(sql,function(error,record,fields){
                    if(error){
                        console.log("pk가져오기 실패",error);
                    }else{
                        console.log("record: ",record);
                        var member2_id = record[0].member2_id;    
                        // ★★★
                        // 성공하면, 회원이 보유한 스킬 정보도 넣어주자.
                        // -> 스킬정보는 member_skill에 넣자(배열의 길이만큼)
                        for(var i=0;i<param.skill_id.length;i++){
                            sql = "insert into member_skill(member2_id,skill_id) values("+member2_id+", "+param.skill_id[i]+")";
                            console.log("스킬 등록쿼리: ",sql);
                            // 쿼리 실행 -> error 중복으로 바꿔주기
                            con.query(sql,function(err){
                                if(err){
                                    alert("회원정보 등록실패");
                                }else{
                                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                                    response.end("회원정보 등록완료");
                                }
                            });
                        }
                    }
                });    // select 쿼리문 수행


            }
        });
        // mysql 등록을 원한다. = 회원가입 목록
        // -> 회원정보는 member2 테이블에 넣고

    }else if(urlJson.pathname=="/member/list"){
        // (마지막) 회원 목록 보여주기
        var sql = "select * from member2";
        con.query(sql,function(error,record,fields){
            // console.log("회원목록:",record);

            // 응답정보를 테이블로 구성하자 = 브라우저에 회원이 쭉 테이블모양으로 보인다.
            var tag = "<table width='100%' border='1px'>";
            tag += "<tr>";
            tag += "<td>member2_id</td>";
            tag += "<td>uid</td>";
            tag += "<td>password</td>";
            tag += "<td>uname</td>";
            tag += "<td>phone</td>";
            tag += "<td>email</td>";
            tag += "<td>receive</td>";
            tag += "<td>addr</td>";
            tag += "<td>memo</td>";
            tag += "</tr>";

            for(var i=0;i<record.length;i++){
                var member = record[i];  // 각각 묶여있는 json 멤버 회원을 끄집어내자.
                tag += "<tr>";  // member/detail로 이동함 = 링크
                tag += "<td><a href='/member/detail?member2_id="+member.member2_id+" '>"+member.member2_id+"</a></td>";
                tag += "<td>"+member.uid+"</td>";
                tag += "<td>"+member.password+"</td>";
                tag += "<td>"+member.uname+"</td>";
                tag += "<td>"+member.phone+"</td>";
                tag += "<td>"+member.email+"</td>";
                tag += "<td>"+member.receive+"</td>";
                tag += "<td>"+member.addr+"</td>";
                tag += "<td>"+member.memo+"</td>";
                tag += "</tr>";
            }

            tag += "<tr>";
            tag += "<td colspan='9'><a href='/'>메인으로</a></td>";
            tag += "</tr>";
            tag +="</table>";
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(tag);
        });
    }else if(urlJson.pathname=="/member/detail"){
        var member2_id=urlJson.query.member2_id;

        // mysql 데이터 가져오기
        var sql = "select * from member2 where member2_id="+member2_id;
        con.query(sql,function(error,record,fields){
            if(error){
                console.log("회원 1건 조회 실패",error);
            }else{
                // console.log("3번 회원의 정보: ",record);
               var obj = record[0];    // 0번째에 들어있는 json추출
                // (마지막추가 detail = 회원의 상세정보)
                fs.readFile("./detail.html","utf-8",function(error,data){
                    if(error){
                        console.log("detail.html 읽기 실패",error);
                    }else{
                        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                        response.end(ejs.render(data,{
                            // json 자체를 보내버림.
                            member:obj
                        })); // 그냥 보내지말고, 서버에서 실행한 후
                                                      // 그 결과를 보내자.
                    }
                });
            }
        });

    }else if(urlJson.pathname=="/fruit"){
        // (datail.ejs -> test 부분)
        var f1 = "Apple";
        var f2 = "Orange";
        fs.readFile("./test.ejs","utf-8",function(error,data){
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            // ejs 를 그냥 파일로 문자취급해서 보내면 원본 코드까지 가버리기 때문에
            // 서버에서 실행을 한 후, 그 결과를 보내야 한다.
            // jsp,php,asp의 원리
            response.end(ejs.render(data,{
                fruit:"Banana"

            }));            
        });
    }
    
});
function getConnection(){
    con = mysql.createConnection(conStr);   // json 매개변수 삽입
}
server.listen(7878,function(){
    console.log("My Server is running at 7878 port..");
    getConnection();
});