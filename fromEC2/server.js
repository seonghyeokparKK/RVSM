var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const res = require('express/lib/response');
var mysql = require('mysql');


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs'); // 렌더링 엔진 모드를 ejs로 설정
app.set('views', __dirname + '/views');    // ejs이 있는 폴더를 지정

app.get('/', (req, res) => {
    res.render('index');    // index.ejs을 사용자에게 전달
})

app.get('/device', (req, res) => { //device connection part
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
    /*---DB 열고 확인하는 절차 거치면 될듯? /
    res.render('index');
});



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

    socket.on('request_data', (trash_temp) => { 
        // <-- 웹브라우저가 데이터 요청시 실행되는 서버함수
        //웹브라우저가 데이터요청(request_data)시 아래 코드처럼 DB에 연결해서 데이터를 받아온다.
        //그런뒤에 다시 웹브라우저에게 데이터를 던져줄려 했으나....
        //지금 ec2가 죽어서....... 더이상 진행불가        
        /* //지금당장은 데이터베이스가 없어서 주석처리
        var conn = mysql.createConnection({
            host: "db-rvsm.cudjy2uvoaml.ap-northeast-2.rds.amazonaws.com",
            user: "omybell7",
            database: "rvsmtest",
            password: "*40211033841*ab",
            port: 3306
        });
        conn.connect(); //db접속
        */

    var data = randomNum(0, 10);

    socket.emit('response_data', data);
    console.log('[server]data received: ' + data);



});


});

server.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});

function randomNum(min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}

