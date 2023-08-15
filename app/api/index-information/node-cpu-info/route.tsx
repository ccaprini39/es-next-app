import { NextResponse } from "next/server"


export async function GET( request: Request ) {

  const url = 'https://localhost:9200/_cat/nodes?v=true&s=cpu:desc&format=json'

  //now lets get the list of indices
  const defaultBody : any = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-store'
  }

  const response = await fetch( url , defaultBody )
  const json = await response.json()
  const stringOfResponse = json[0].cpu + '%'
  
  return NextResponse.json( {data : stringOfResponse} )
}