// eslint-disable-next-line no-undef
var db = require('../db')

const getFocusedAircraft = async (callsign) => {
    let data = null;
    try {
      const current_flights = db.get().collection('current_flights');
      const trails = db.get().collection('flights_history');
      const flight = await current_flights.findOne({callsign: callsign});

      if (flight.type === 'atc') {
        return flight;
      }
      
      const { cid } = flight;
      const trailDoc = await trails.findOne({callsign: callsign, cid: cid});
  
      flight["trail"] = trailDoc.trail;
      data = flight;
      return data;
  
    } catch (error) {
      return data;
    }
  }

const getAllStations = async () => {
    let pilots = []
    let atc = []
    try {
      const collection = db.get().collection('current_flights');
      pilots = await collection.find({'type': 'pilot'}).toArray();
      atc = await collection.find({'type': 'atc'}).toArray();
      return {pilots, atc};
    } catch (error) {
      console.log(error)
      return {pilots: [], atc: []}
    }
  }

const getAirports = async () => {
  try {
    const collection = db.get().collection('airports');
    return collection.find().toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = {
    getFocusedAircraft,
    getAllStations,
    getAirports,
}