import { NextResponse } from "next/server"

/**
 * Function that gets the basic ES server status
 * @returns 
 */
export async function GET( request: Request ) {

  const response = await fetch( 'https://localhost:9200' , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-cache'
  } )

  //
  const data = await response.json()
  return NextResponse.json( { data } )
}
