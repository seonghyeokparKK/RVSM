
import PatientState from "./components/PatientState"
import { useEffect, useState } from "react";
import {io} from 'socket.io-client';

export default function PatientStatePage(){
    let socket
    let address="http://localhost:3000"
    const userName="PATIENT_STATE"

    const [dates,setDates]=useState(['0','0','0','0','0','0','0','0','0'])
    const [heartRates,setHeartRates]=useState([0, 0, 0, 0, 0, 0,0,0,0])
    const [spo2s,setSpo2s]=useState([0, 0, 0, 0, 0, 0,0,0,0])
    const [highestHeartRate,setHighestHeartRate]=useState(-1);
    const [lowestHeartRate,setLowestHeartRate]=useState(-1);
    const [highestSpo2,setHighestSpo2]=useState(-1);
    const [lowestSpo2,setLowestSpo2]=useState(-1);
    const [patientName,setPatientName]=useState("");
    const [adminName,setAdminName]=useState("");
    
    
    let newData=[]//새로 받은 데이터가 들어감
    let lastTime;
    
    useEffect(()=>{//io를 연결하고 환자명, 관리자명 받기 한번만 실행된다
        //lastTime=getCurrentTime();//실제 실행때는 이것을 사용함
        lastTime="2022-05-20 17:30:26";//테스트를 위해서 특정 날짜
        socket=io.connect(address);
        socket.emit('web_request_user_info','1');
        socket.on('response_data', (data) => {//서버가 보낸 생체 데이터를 받음
            if(data.length!=0){
                newData = data;//서버가 보낸 데이터
                X_shift();//데이터 받았으니 받은 데이터를 그래프에 업데이트  
            }
            
        });

        socket.on('patient_info',(data)=>{//서버로 부터 환자명, 관리자명 받고 화면에 표시
            setPatientName(data.patient_name);
            setAdminName(data.admin_name);
        })

        const interval=setInterval(requestData, 3000);//3초에 한번 생체 데이터 요청
        return ()=>clearInterval(interval)
    },[])


    function requestData(){//서버에게 환자 생체 데이터 요청하는 함수
        let data={
            user_name:userName,//테이블 이름, 환자 id
            time:lastTime//이 시간 이후의 데이터만 가져온다
        }
        
        socket.emit('request_data', data);//서버로 요청
    }

        
    function X_shift() {//데이터를 넣고 그래프를 업데이트하는 함수
        const newDataLen=Object.keys(newData).length
        lastTime=newData[newDataLen-1].TIME
        for(let i=0;i<newDataLen;i++){
            setDates((current)=>{
                const copyArray=[...current]
                copyArray.push(newData[i].TIME)
                copyArray.shift()
                return copyArray
            })
            setHeartRates((current)=>{
                const copyArray=[...current]
                copyArray.push(newData[i].HeartRate)
                copyArray.shift()
                setHeartRateInfo(newData[i].HeartRate);//최대최소값 설정
                return copyArray
            })
            setSpo2s((current)=>{
                const copyArray=[...current]
                copyArray.push(newData[i].Spo2)
                copyArray.shift()
                setSpo2Info(newData[i].Spo2);
                return copyArray
            })
            
        }
        
    }
    function setHeartRateInfo(data){//최저 최대 심박수 표시
        setHighestHeartRate((current)=>{
            if(current==-1){
                return data
            }
            else{
                if(current<data){
                    return data
                }
                else{
                    return current
                }
            }
        })
        setLowestHeartRate((current)=>{
            if(current==-1){
                return data
            }
            else{
                if(current>data){
                    return data
                }
                else{
                    return current
                }
            }
        })
    }
    function setSpo2Info(data){//최저 최대 산소포화도 표시 
        setHighestSpo2((current)=>{
            if(current==-1){
                return data
            }
            else{
                if(current<data){
                    return data
                }
                else{
                    return current
                }
            }
        })
        setLowestSpo2((current)=>{
            if(current==-1){
                return data
            }
            else{
                if(current>data){
                    return data
                }
                else{
                    return current
                }
            }
        })
    }
    function getCurrentTime()//현재시간을 구하는 함수
        {
            var now = new Date();	// 현재 날짜 및 시간
            now.setSeconds(now.getSeconds()-2);//현재에서 2초전으로 변경
            //now.setHours(now.getHours()-9);
            var year=now.getFullYear();
            var mon=now.getMonth()+1;
            var day=now.getDate();
            var hh=now.getHours();
            var min=now.getMinutes();
            var ss=now.getSeconds();
            var time=year+"-"+mon+"-"+day+" "+hh+":"+min+":"+ss;//현재에서 5초전 날짜와 시간
            //console.log("time="+time);
            return time;
        }
    return (
        <div>
            <PatientState 
                patientName={patientName}
                adminName={adminName}
                highestHeartRate={highestHeartRate}
                lowestHeartRate={lowestHeartRate}
                highestSpo2={highestSpo2}
                lowestSpo2={lowestSpo2}
                dates={dates}
                heartRates={heartRates}
                spo2s={spo2s}
               
                />
        </div>
    )

}