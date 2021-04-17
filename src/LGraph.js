import React,{useState,useEffect} from 'react';
import {Line} from"react-chartjs-2";
import numeral from "numeral";

const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipItem,dat){
                return numeral(tooltipItem.value).format("+0.0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:'ll',
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callback:function(value,index,values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}

function LGraph({casesType, ...props}) {
    const[data,setData]= useState({});

    const buildData=(data,casesType) =>{
        const chartData=[];
        let lastDataPoint;
        for(let date in data.cases) {
            if (lastDataPoint){
                const newdatapoint={
                    x:date,
                    y:data[casesType][date]-lastDataPoint
                }
                chartData.push(newdatapoint);
            }
            lastDataPoint=data[casesType][date];       
        };
        return chartData;
    
    };

    useEffect(()=>{
        const fetchdata= async()=>{
            await  fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response =>response.json())
            .then(data =>{
                const chartdata=buildData(data,casesType);
                setData(chartdata);
        
            });

        }
        fetchdata();
   
},[casesType]);
    return (
        <div className={props.className}>
            {data?.length > 0 &&(
            <Line 
            options={options}
            data={{
                datasets:[{
                    data:data,
                    backgroundColor:'rgba(202,14,50,0.5)',
                    borderColor:"#CC1022",

                },
            ],
            }}/>)}
          
        </div>
    );
}

export default LGraph;
