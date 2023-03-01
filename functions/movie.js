const axios = require('axios')
const { OMDB_API_KEY } = process.env
//const OMDB_API_KEY = process.env.OMDB_API_KEY 구조분해

exports.handler = async function( event ){
  console.log(event)
  const payload = JSON.parse( event.body )
  //네트워크에서는 문자형태로 전달되는 변환 필요! JSON.parse()
 
  const { title, type, year, page, id } = payload
  const url = id
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`

  try{
    const {data} = await axios.get(url)
    if(Date.Error){
      return{
        statusCode : 400,
        body : data.Error
      }
    }
    return {
      statusCode : 200,
      body : JSON.stringify(data)
    }
  }catch(error){
    return{
      statusCode : error.response.status,
      body : error.message
    }
  }
}