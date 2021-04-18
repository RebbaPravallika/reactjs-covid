import React,{ useState, useEffect} from 'react';
import './App.css';
import StatsBox from './StatsBox';
import Map from './Map';
import Tables from './Tables';
import {sortByCases,prettyPrintStat} from "./util";
import LGraph from "./LGraph";
import "leaflet/dist/leaflet.css";
import{
  MenuItem,FormControl,Select,Card,CardContent,
} from "@material-ui/core";
import "./StatsBox.css"

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('WorldWide');
  const [countryINFO,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapcenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapzoom, setMapZoom] = useState(3);
  const[isLoading,setLoading]=useState(false);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response => response.json()))
    .then(data =>{
      setCountryInfo(data);
    });
  },[]);


  useEffect(()=>{
    const getCountries =async() =>{
      await fetch("https:disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country) =>(
          {
            name: country.country,
            value: country.countryInfo.iso3
          }));
          const sorted_data=sortByCases(data);
          setTableData(sorted_data);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountries();
  },[]);
  const onCountryChanged= async(event) =>{
    setLoading(true);
    const countryCodeIndex=event.target.value;
    setCountry(countryCodeIndex);

    const url=
    countryCodeIndex==='WorldWide' 
    ? 'https://disease.sh/v3/covid-19/all'
    :`https://disease.sh/v3/covid-19/countries/${countryCodeIndex}`;

     await fetch(url).then((response)=>response.json())
    .then((data)=>{
      setCountry(countryCodeIndex);
      setCountryInfo(data);
      setLoading(false);
      if(countryCodeIndex==='WorldWide'){
        setMapCenter([20.5937,78.9629 ]);
      }
      else{
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);}
      setMapZoom(4);
    });
      console.log(countryINFO);
  };
  /*console.log(countryINFO);*/

  return (
    <div className="app">
      <div className="app__firstpart">
      <div className="app__header">
          <h1 className="title">COVID-19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChanged}>
                <MenuItem value="WorldWide">WorldWide</MenuItem>
                {countries.map((country) =>(
                 <MenuItem value={country.value}>{country.name}</MenuItem>

          ))}
  
            </Select>

          </FormControl>
      </div>
      {/*header*/}
      {/*title+input*/}
      <div className="app__Statistics">
        <StatsBox className="infoBox_cases"
        onClick={(e) => setCasesType("cases")}
        isRed 
        active={casesType==="cases"} title="Cases" 
        cases={prettyPrintStat(countryINFO.todayCases)} 
        total={prettyPrintStat(countryINFO.cases)}
        isLoading={isLoading}
        />

        <StatsBox className="infoBox_recovered"
        isGreen
        onClick={(e) => setCasesType("recovered")}
        title="Recovered" 
        active={casesType==="recovered"}
        cases={prettyPrintStat(countryINFO.todayRecovered)} 
        total={prettyPrintStat(countryINFO.recovered)}
        isLoading={isLoading}
        
        />

        <StatsBox className="infoBox_deaths" 
        onClick={(e) => setCasesType("deaths")}
        title="Deaths" 
        isGrey
        active={casesType==="deaths"}
        cases={prettyPrintStat(countryINFO.todayDeaths)} 
        total={prettyPrintStat(countryINFO.deaths)}
        isLoading={isLoading}/>
      </div>
      
      <div>
        <Map center={mapcenter}
        zoom= {mapzoom}
        countries={mapCountries}
          casesType={casesType}/>
      </div>

      {/*map*/}

      </div>
      <Card className="app__secondPart">
         <CardContent>
           <h3>Live Cases by Country</h3>
           <Tables countries={tableData}/>
           <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
           <LGraph className="app__graph" casesType={casesType}/>

         </CardContent>
         {/* Table */}
        {/* Graph */}
         
      </Card>  
    </div>
  );
}

export default App;
