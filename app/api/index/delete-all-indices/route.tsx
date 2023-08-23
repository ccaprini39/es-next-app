//this is an endpoint that takes a get request and deletes all existing indices

import { NextResponse } from "next/server"

interface IndexInformation {
  'index': string
  'docs.count': string
  'store.size': string
  'mapping': string
}

/**
 * Function that deletes all existing indices
 * @returns the response from the ES server
 */
export async function GET( request: Request ) {
  //now lets get the list of indices
  const url = 'https://localhost:9200/_cat/indices?format=json&pretty=true&h=index,docs.count,store.size&bytes=b'

  const allIndices = await fetch( url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-cache'
  } )

  const allIndicesData = await allIndices.json() as IndexInformation[]
  const allIndicesNames = allIndicesData.map( index => index.index )

  //now lets delete all the indices
  const deleteAllIndices = await fetch( 'https://localhost:9200/' + allIndicesNames.join(',') , {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-cache'
  } )


  //
  const data = await deleteAllIndices.json()
  
  return NextResponse.json( data )
}