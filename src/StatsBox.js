import React from 'react';
import {Card,CardContent,Typography}  from "@material-ui/core";
import "./StatsBox.css"
function StatsBox({title,isRed,isGreen,active,isGrey,cases,total,ocpp,population, ...props}) {
    return (
        <div>
            <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} ${isGrey && "infoBox--grey"}`}
            onClick={props.onClick}>
                <CardContent>
                    <Typography color="primary">{title}</Typography>
                    <h2 className={`infoBox_cases ${isGreen && "infoBox_cases--green"} ${isGrey && "infoBox_cases--grey"}`}>{cases}</h2>
                    <Typography className="infoBox_total" color="textSecondary"><bold>Total </bold>{total}</Typography>
                    
                </CardContent>
            </Card>
            
        </div>
    )
}
export default StatsBox
