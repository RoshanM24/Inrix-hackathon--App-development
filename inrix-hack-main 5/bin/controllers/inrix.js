const { carsData } = require("../../carsData");
const { sendRequest } = require("../custom/auxiliary");
const customError = require('../custom/customError');
const Trip = require("../models/trip");
const User = require("../models/user");

exports.getRoute = async(req,res)=>{
    try{
        let body = req.body;
        const url = `${process.env.INRIX_API}findRoute?wp_1=${body.wp_1}&wp_2=${body.wp_2}&routeOutputFields=P&format=json&maxAlternates=2`
        console.log(url,"url");
        const resp=  await sendRequest({},{Authorization:`Bearer ${global.inrixtoken}`},url,"GET");
        if(!resp) throw customError.badRequest
        console.log(resp,"resp");
        const modifiedData = processCoordinates(resp);
        res.status(200).json({
            success: true,
            data:modifiedData,
            message:`Route`,
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl,error} error`);
        res.status(200).json({
            success: false,
            data:error,
        });
    }
}

exports.endTrip = async(req,res)=>{
    try{
        let body = req.body;
        if(!body.tripInfo || !body.userId)  throw customError.dataInvalid
        let user = await User.findById(body.userId)
        console.log(user,"user")
        let ef
        if(user.fuelType === "Diesel"){
            ef = carsData.ef_diesel
        }
        else if(user.fuelType === "Petrol"){
            ef = carsData.ef_gasoline
        }
        let carbonFootprint = ((ef/carsData[user.fuelType][user.carType])*(body.tripInfo.totalDistance)).toFixed(2)
        let trip = new Trip({
            tripId:body.tripInfo.id,
            userId:body.userId,
            tripInfo:body.tripInfo,
            carbonFootprint:carbonFootprint
        })
        await User.updateOne({_id:body.userId},{
            $inc:{carbonFootPrint:carbonFootprint}
        })
        await trip.save();
        res.status(200).json({
            success: true,
            // data:trip,
            message:`Trip Saved Successfully`,
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl,error} error`);
        res.status(200).json({
            success: false,
            data:error,
        });
    }
}

function processCoordinates(data) {
    // Access the coordinates from the data
    const routes = data.result.trip.routes;

    // Process each route's coordinates
    const processedCoordinates = routes.map(route => {
        return route.points.coordinates.map(coord => {
            return {
                lat: coord[1],
                lng: coord[0]
            };
        });
    });

    // Find the index of the route with the shortest distance
    const shortestRouteIndex = routes.reduce((minIndex, route, currentIndex) => {
        const minDistance = routes[minIndex].totalDistance;
        const currentDistance = route.totalDistance;

        return currentDistance < minDistance ? currentIndex : minIndex;
    }, 0);

    // Add the "shortest: true" key to the route with the shortest distance
    routes.forEach((route, index) => {
        route.points.coordinates = processedCoordinates[index];
        route.shortest = index === shortestRouteIndex;
    });

    return data;
}

