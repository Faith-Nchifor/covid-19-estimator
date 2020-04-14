let impact={
    currentlyInfected:0,
    infectionsByRequestedTime:0,
}; // my best case estimation
let severeImpact={
    currentlyInfected:0,
    infectionsByRequestedTime:0,
    severeCasesByRequestedTime:0,
    hospitalBedsByRequestedTime:0,
    casesForICUByRequestedTime:0,
}; // my worst case estimator
const covid19ImpactEstimator = (data) => {
    const {reportedCases,timeToElapse,periodType,totalHospitalBeds}=data;
    const {avgDailyIncomeInUSD} = data.region;
    const {avgDailyIncomePopulation}= data.region;
    let currentlyInfected= reportedCases * 10;
    impact.currentlyInfected += currentlyInfected;
    //for severe impact
    severeImpact.currentlyInfected= reportedCases * 50;

    //calculate infections requested time
    if(periodType==='days'){
        impact.infectionsByRequestedTime += impact.currentlyInfected * (2 * Math.floor(timeToElapse/3))
        severeImpact.infectionsByRequestedTime += severeImpact.currentlyInfected * (2 * Math.floor(timeToElapse/3))
    }
    else if(periodType==='months'){
        timeToElapse *= 30;
        impact.infectionsByRequestedTime += impact.currentlyInfected * (2 * Math.floor(timeToElapse/3))
        severeImpact.infectionsByRequestedTime += severeImpact.currentlyInfected * (2 * Math.floor(timeToElapse/3))
    }
    else if(periodType==='weeks'){
        timeToElapse *= 7;
        impact.infectionsByRequestedTime += impact.currentlyInfected * (2 * Math.floor(timeToElapse/3))
        severeImpact.infectionsByRequestedTime += severeImpact.currentlyInfected * (2 * Math.floor(timeToElapse/3))
    }

    // calculating severe reported cases by requested time
    severeImpact.severeCasesByRequestedTime =Math.floor((15/100) * severeImpact.infectionsByRequestedTime);

    //the number of available beds
    let hospitalBedsByRequestedTime= severeImpact.severeCasesByRequestedTime - ((35/100) * totalHospitalBeds);
    severeImpact.hospitalBedsByRequestedTime=hospitalBedsByRequestedTime;

    // estimating the cases that require icu care
    severeImpact.casesForICUByRequestedTime= Math.floor((50/100) * severeImpact.infectionsByRequestedTime);
    //determining the number of cases that require ventilators
    let casesForVentilatorsByRequestedTime = Math.floor((2/100) * severeImpact.infectionsByRequestedTime);
    severeImpact.casesForVentilatorsByRequestedTime= casesForVentilatorsByRequestedTime;

    // estimating how much money the ecomomy is said to loose over a period of time(timeto elapse)
    switch(periodType){
        case 'days':  severeImpact.dollarsInFlight=Math.floor( (severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD)/timeToElapse);
            break;
        case 'months':  
            timeToElapse *= 30;
            severeImpact.dollarsInFlight=Math.floor( (severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD)/timeToElapse);
            break;
        case 'weeks':
            timeToElapse *=7;
            severeImpact.dollarsInFlight=Math.floor( (severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD)/timeToElapse);
    }

    return 
        {
            data:data,
            impact: impact,
            severeImpact: severeImpact
        }
    
   
    
};

export default covid19ImpactEstimator;
