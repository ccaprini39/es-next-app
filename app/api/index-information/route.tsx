import { NextResponse } from "next/server"

/**
 * Function that gets the basic ES server status
 * @returns 
 */
export async function GET( request: Request ) {
  //now lets get the list of indices
  const url = 'https://localhost:9200/_cat/indices?format=json&pretty=true&h=index,docs.count,store.size&bytes=b'

  const response = await fetch( url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-cache'
  } )

  //
  const data = await response.json()
  return NextResponse.json( data )
}
