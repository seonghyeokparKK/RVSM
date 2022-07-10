<<<<<<< HEAD
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// const res = require('express/lib/response');
var mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'rvsm'
})
connection.connect();

var bodyParser = require('body-parser');
const { sensitiveHeaders } = require('http2');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs'); // 렌더링 엔진 모드를 ejs로 설정
app.set('views', __dirname + '/views');    // ejs이 있는 폴더를 지정

app.get('/', (req, res) => {
    console.log('get method </>');
    res.render('index');    // index.ejs을 사용자에게 전달
})

app.get('/feeding_notice', (req, res) => {
    console.log('get method </feeding_notice>');
    res.render('index');    // index.ejs을 사용자에게 전달
})

app.get('/index', (req, res) => {
    console.log('get method </>');
    res.render('index');    // index.ejs을 사용자에게 전달
})


app.get('/sign_up', (req, res) => {
    res.render('sign_up');    // index.ejs을 사용자에게 전달
})

app.post('/login', function (req, res) {
    console.log("post request (from '/sign_up' to '/login') ");
    console.log("id :", req.body.id);
    console.log("password :", req.body.password);

    /*---받은 아이디와 password를 확인하는 절차를 거치고, 맞으면 res.render(index), 틀리면 틀렸다고 안내 ---*/
    /*---DB 열고 확인하는 절차 거치면 될듯? */
    res.render('index');
});


function ins_data(a, b, c) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var now = year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds;

    var sql = 'INSERT INTO PATIENT_STATE (HospitalCode,ID,TIME,Temperature,HeartRate,Spo2) VALUES(?,?,?,?,?,?)';
    var param = ["YUMC", 2, now, a, b, c];

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

});

server.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});

function randomRealNum(min, max) {
    var randRealNum = Math.round(Math.random() * 10) / 10 + 36;
    return randRealNum;
}

function randomNum(min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}

=======
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// const res = require('express/lib/response');
var mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'rvsm'
})
connection.connect();

var bodyParser = require('body-parser');
const { sensitiveHeaders } = require('http2');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs'); // 렌더링 엔진 모드를 ejs로 설정
app.set('views', __dirname + '/views');    // ejs이 있는 폴더를 지정

app.get('/', (req, res) => {
    console.log('get method </>');
    res.render('index');    // index.ejs을 사용자에게 전달
})

app.get('/feeding_notice', (req, res) => {
    console.log('get method </feeding_notice>');
    res.render('index');    // index.ejs을 사용자에게 전달
})

app.get('/index', (req, res) => {
    console.log('get method </>');
    res.render('index');    // index.ejs을 사용자에게 전달
})


app.get('/sign_up', (req, res) => {
    res.render('sign_up');    // index.ejs을 사용자에게 전달
})

app.post('/login', function (req, res) {
    console.log("post request (from '/sign_up' to '/login') ");
    console.log("id :", req.body.id);
    console.log("password :", req.body.password);

    /*---받은 아이디와 password를 확인하는 절차를 거치고, 맞으면 res.render(index), 틀리면 틀렸다고 안내 ---*/
    /*---DB 열고 확인하는 절차 거치면 될듯? */
    res.render('index');
});


function ins_data(a, b, c) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var now = year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds;

    var sql = 'INSERT INTO PATIENT_STATE (HospitalCode,ID,TIME,Temperature,HeartRate,Spo2) VALUES(?,?,?,?,?,?)';
    var param = ["YUMC", 2, now, a, b, c];

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

});

server.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});

function randomRealNum(min, max) {
    var randRealNum = Math.round(Math.random() * 10) / 10 + 36;
    return randRealNum;
}

function randomNum(min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}

>>>>>>> 34d41c3270d6bbe96a574e4bca312d19f4d14ee1
