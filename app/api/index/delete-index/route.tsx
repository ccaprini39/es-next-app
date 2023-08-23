import { NextResponse } from "next/server"

export async function GET( request: Request ) {
  //now lets get the list of indices
  const requestBody = await request.json()
  const { index } = requestBody


  //now lets delete all the indices
  const deleteIndex = await fetch( `https://localhost:9200/${index}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-cache'
  } )
  const data = deleteIndex.json()
  return NextResponse.json( data )
}