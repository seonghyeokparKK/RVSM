const express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server,{
    cors:{
        origin:"http://localhost:3005",//프론트 서버 주소, 추후 ec2테스트, 수정 필요
        methods:['POST']
    }
});
var mysql = require('mysql');

const port=3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'RVSM',
    dateStrings:"date",
    
})
connection.connect();//DB연결

var bodyParser = require('body-parser');
const { sensitiveHeaders, Http2ServerRequest } = require('http2');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//웹페이지 프론트 부분 전달하는것은 프론트 서버 (next js)에서 담당하여 지웠습니다

function ins_data(a, b, c) {//DB데이터 넣는 함수
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var now = year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds;

    var sql = 'INSERT INTO PATIENT_STATE (HospitalCode,ID,TIME,Temperature,HeartRate,Spo2) VALUES(?,?,?,?,?,?)';
    var param = ["YUMC", 1, now, a, b, c];

    connection.query(sql, param, function (err, rows, fields) {
        if (err) {
            console.log("=========ERROR==========");
            console.log(err);
        } else {
            console.log("=========DB 저장=========");
            console.log(param);
            console.log("=======================");
        }
    })
}

// DB 삭제
function del_data() {
    var sql2 = "DELETE FROM PATIENT_STATE WHERE TIME < DATE_SUB(NOW(), INTERVAL 10 SECOND) ;"

    connection.query(sql2, function (err, rows, fields) {
        if (err) {
            console.log("=========ERROR==========");
            console.log(err);
        } else {
            console.log("=========삭제 완료=========");
        }
    })
}

io.on('connection', (socket) => {
    //연결이 들어오면 실행되는 이벤트
    //socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.    
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    socket.emit('usercount', io.engine.clientsCount);
    console.log("connected")
    // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
    socket.on('message', (msg) => {
        //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
        console.log('Message received: ' + msg);

        // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
        io.emit('message', msg);
    });

    socket.on('data', (device_data) => {
        //new sensor data from the device
        // serialport.write(data);
        console.log('-------------------i did it !----------------------------');
        console.log(device_data);

        //const json = '{"result":true, "count":42}';
        //const obj = JSON.parse(json);
        //console.log(obj.count);

        // let json = JSON.stringify(device_data);
        // let foo = JSON.parse(json);
        // console.log(foo.sensor_1[0]);


        var sensor1_data = randomRealNum(35, 37);       // Temperature
        var sensor2_data = randomNum(60, 100);       // HeartRate 
        var sensor3_data = randomNum(90, 100);      // Spo2

        //여기부터 DB 저장 작업 해주시면 됩니다. 위의 3줄이 센서로부터 입력받는 데이터라고 가정하면 됨 ^0^ ... edit by joonik
        //DB 저장 및 주기적 DB 삭제!

        // DB 저장
        console.log('Success');

        ins_data(sensor1_data, sensor2_data, sensor3_data);
        del_data();

        var Temperature = sensor1_data;

        socket.emit('data', Temperature);

    });

    socket.on('request_data', (data) => { //환자 그래프 데이터 전송함수
        var sql=`SELECT * FROM ${data.user_name} WHERE time > "${data.time}"`
        connection.query(sql,function(err,rows,fields){//DB에서 데이터를 뽑아 웹페이지에 전달
            if(err){
                console.log("에러발생");
                console.log(err);
            }
            else{
                console.log("-------웹에 전달함--------")
                console.log(rows);
                console.log("---------------------------------")
                socket.emit('response_data',rows);//웹에전달
            }
        })
      
    });

    socket.on('web_request_user_info',function(data){//환자 이름, 담당자 이름 전송함수
        //웹에서 환자 id를 보내온다, id를통해 환자이름 가져온다
        //담당자이름은 아마 병원코드로 알아내야 할듯함? 
        console.log(data)
        sql=`SELECT * FROM PATIENT WHERE ID="${data}"`
        patient_name=''
        hospital_code=''
        admin_name=''
        connection.query(sql,function(err,rows,fields){//DB에서 데이터를 뽑아 클라이언트에 전달
          if(err){
              console.log("에러발생");
              console.log(err);
          }
          else{
              patient_name=rows[0].NAME
              hospital_code=rows[0].HospitalCode
              sql2=`SELECT * FROM ADMIN WHERE HospitalCode="${hospital_code}"`
              connection.query(sql2,function(err,rows,fields){//DB에서 데이터를 뽑아 클라이언트에 전달
              if(err){
                console.log("에러발생");
                console.log(err);
              }
              else{
                admin_name=rows[0].Name
                patient_info={patient_name:patient_name, admin_name: admin_name}
                console.log("userinfo 전달됨: ",patient_info)
                socket.emit('patient_info',patient_info)
              }
            })
          }
        })
       
      
    })

});



function randomRealNum(min, max) {
    var randRealNum = Math.round(Math.random() * 10) / 10 + 36;
    return randRealNum;
}

function randomNum(min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}


  server.listen(port, function () {
    console.log(`Listening on http://localhost:${port}/`);
});
