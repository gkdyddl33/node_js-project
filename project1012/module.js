/* 
    Node.js 가 전세계적으로 열풍을 일으킨 이유는?
    가장 큰 이유가, 바로 모듈 때문이다.

    모듈이란?
    우리가 지금까지 자바스크립트 라이브러리를, 파일로 저장해 놓은 
    단위이다.

    Node.js 모듈의 특징 : 전 세계 많은 개발자들이 각자 자신이 개발한 모듈을
                                공유하고 있다. 따라서 지금 이 순간에도 새로운 모듈이 계속 추가되고 있다.
    
    [ 모듈의 유형 ]                                
    1) 내장 모듈
        - os 모듈
        - url 모듈  : url의 정보를 분석해주는 모듈
        - file system 모듈 ★★
    2) 사용자 정의 모듈
*/
//var os = require("os");     // 이미 내장된 모듈 중 os 모듈을 가져오기
                                      // 자바스크립트와는 달리,
                                      // 모듈을 가져올 떄는 require() 함수를 이용해야 한다.
//console.log(os.hostname()); // 컴퓨터 이름이 출력
//


//var url = require("url");
//var result = url.parse("https://en.dict.naver.com/#/search?range=all&query=apple");
// console.log("검색어는 ",result.query);


var fs = require("fs"); // 로컬상의 파일을 읽어 오거나,
                                // 쓸수 있는 모듈
fs.readFile("./memo.txt","utf-8",function(error,data){
    // 지정한 경로의 파일을 읽어서, 다 읽혀지면 두 번쨰 인수인 익명함수 호출
    // 이렇게 특정 이벤트가 발생할 때 시스템에 의해 역으로 호출되는
    // 유형의 함수를 "callback" 함수라 한다.

    // 콜백함수의 첫번째 매개변수는 error가 발생했을 때, 두번째 매개변수는 data를 다 읽었을 때    
    console.log("파일을 모두 읽기 완료했어요.");
    console.log(data);
});                                