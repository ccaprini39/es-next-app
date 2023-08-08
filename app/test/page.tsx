async function loadData(){
  console.log('loadData')
  let basicGet = await fetch('http://localhost:3000/api/index-information', {
    method: 'GET',
    cache: 'no-cache',
  })
  
  basicGet = await basicGet.json()
  console.log( 'basicGet', basicGet)

  return { basicGet }
}

export default async function TestPage(){
  const { basicGet } = await loadData()

  return (
    <div>
      <h1>Test Page</h1>

      <p>Test page content</p>
      <pre>
        {JSON.stringify(basicGet, null, 2)}
      </pre>
    </div>
  )
}