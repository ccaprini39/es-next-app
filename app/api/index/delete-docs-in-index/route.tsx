import { NextResponse } from "next/server"

export async function POST(request: Request) {
  //now lets get the list of indices
  const requestBody = await request.json()
  const { index } = requestBody

  const url = 'https://localhost:9200/' + index


  const deleteAllDocsInIndex = await fetch(url + '/_delete_by_query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + process.env.ES_AUTH
    },
    body: JSON.stringify({
      "query": {
        "match_all": {}
      }
    }),
    cache: 'no-cache'
  })
  const json = await deleteAllDocsInIndex.json()


  return NextResponse.json(json)
}