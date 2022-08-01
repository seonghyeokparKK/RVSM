import { useRef,useEffect, useState } from "react"
import {Table} from 'react-bootstrap';
import {Chart as ChartJS} from 'chart.js/auto'
import {Line} from "react-chartjs-2"
export default function PatientState({patientName,adminName,highestHeartRate,lowestHeartRate,highestSpo2,lowestSpo2,dates,heartRates,spo2s}){
    const notice="측정 수치는 여러 요소에 따라 달라질 수 있습니다.\n자세한 내용은 xx를 참조하세요."
    
 
   let data={
    
        labels: dates,
        datasets:[
            {
                type:'line',
                label:'HeartRate',
                backgroundColor: 'rgba(255, 99, 132, 1)',//선색
                borderColor: 'rgba(255, 99, 132, 1)',//선 테두리색
                borderWidth: 1,
                data: heartRates
            },
            {
                type:'line',
                label: 'Spo2',
                backgroundColor: 'rgba(87, 98, 255, 1)',//선색
                borderColor: 'rgba(87, 98, 255, 1)',//선 테두리색
                borderWidth: 1,
                data: spo2s
            }
        ]
    
   }
    
    let options={
        maintainAspectRatio:false,//사용자 정의 크기에 따라 그래프 크기가 결정된다
        
        plugins:{
            legend:{
                position:'bottom',//범례위치
                    labels:{
                        boxHeight:1//범례옆에 네모 높이
                    }
            }
        },
        animation:{
            duration:0
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
        
    }
    return (
        <div>
            <div id="title">Vital Sign Chart</div>
            <div id="red_line"></div>

            <div id="info_box">
                <div id="user_info_box">
                    <div id="user_info">
                        <div>
                            <Table>
                                <tbody>
                                   <tr>
                                    <th>이름</th>
                                    <td colSpan="2" id="patient_name">{patientName}</td>
                                </tr>
                                <tr>
                                    <th>심박</th>
                                    <td>최저: <span id="lowest_heartRate">{lowestHeartRate}</span></td>
                                    <td>최대: <span id="highest_heartRate">{highestHeartRate}</span></td>
                                </tr>
                                <tr>
                                    <th>산소포화도</th>
                                    <td>최저: <span id={"lowest_spo2"}>{lowestSpo2}</span></td>
                                    <td>최대: <span id={"highest_spo2"}>{highestSpo2}</span></td>
                                </tr>
                                <tr>
                                    <th>관리자</th>
                                    <td colSpan="2" id={"admin_name"}>{adminName}</td>
                                </tr> 
                                </tbody>
                                
                            </Table>
                        </div>
                    </div>
                </div>
                <div id={"notice_box"}>
                    <div id={"notice"}>
                        <div>
                            {
                                notice.split('\n').map(line=>{
                                    return (<span>{line}<br/></span>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div>차트</div>
                <div id={"green_line"}></div>
                <div id={"chart_box"}>
                    <Line 
                        type="line" 
                        data={data} 
                        options={options}
                        />
                </div>
                    
                

            <div id={"green_line"}></div>
            <style jsx>
                {`
                #title{
                    padding-left: 10px;
                    padding-top: 10px;
                    color: #e13323;
                    font-weight: bold;
                    font-size: 20px;
                }
                #red_line{
                    margin-top: 10px;
                    margin-bottom:10px ;
                    height:2px;
                    background-color: #e13323;
                }
                #green_line{
                    margin-top: 10px;
                    margin-bottom:10px ;
                    height:2px;
                    background-color: #008264;
                }
                #info_box{
                    overflow: hidden;
                    margin-bottom: 15px;
                }
                #user_info_box{
                    width: 70%;
                    height: 150px;
                    float: left;
                    margin-bottom:10px;
                }
                #notice_box{
                    width:30%;
                    height: 150px;
                    float: left;
                }
                #notice{
                    right:0;
                    height: 150%;
                    width:260px;
                    margin:0 auto;
                    background-color: rgb(250, 158, 140);
                    text-align: center;
                    word-break: normal;
                    font-size: 10px;
                    padding-top: 40px;
                }
                #chart_box{
                   height: 45vh;
                   width:100vw;
                }
                Table{
                   font-size: 15px;
                   
                }
                td{
                    text-align:center
                }
                
                `}
            </style>
        </div>
    )
}
