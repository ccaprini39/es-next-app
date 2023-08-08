//this is an endpoint that takes a get request and deletes all existing indices

import { NextResponse } from "next/server"

/**
 * Function that deletes all existing indices
 * @returns the response from the ES server
 */
export async function GET( request: Request ) {
  //now lets get the list of indices
  const url = 'https://localhost:9200/_all'

  const response = await fetch( url , {
    method: 'DELETE',
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