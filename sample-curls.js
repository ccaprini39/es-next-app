const sampleQuery = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/performance_test/_search' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure \
--header 'Content-Type: application/json' \
--data '{
  "explain": false,
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "name": "\\{\\n    \"data\": \"BUGS BUNNY\",\\n    \"entityType\": \"PERSON\"\\n\\}"
          }
        },
        {
          "match": {
            "dob": "19400430"
          }
        }
      ]
    }
  },
  "rescore": {
    "query": {
      "rescore_query": {
        "function_score": {
          "doc_score": {
            "fields": {
              "name": {
                "query_value": {
                  "data": "BUGS BUNNY",
                  "entityType": "PERSON"
                }
              },
              "dob": {
                "query_value": "19400430"
              }
            }
          }
        }
      },
      "query_weight": 0.0,
      "rescore_query_weight": 1.0
    }
  }
}'
`

const querySize1000 =  `
curl --location "https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/performance_test/_search?size=1000" \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--header 'Content-Type: application/json' \
--insecure \
-d '{
  "query": {
    "function_score": {
      "random_score": {},
      "boost": 0
    }
  }
}'
`

const sampleNodeStats = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_nodes/stats?pretty' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure
`

//now I only want to get the node stats for 

const sampleGetHeap = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/nodes?h=heap*&v' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure
`

const getRamInfo = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/nodes?h=ram*&v' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure
`

const getCpuInfo = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/nodes?h=cpu*&v' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure
`

const getListOfIndices = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/indices?format=json&pretty=true&h=index' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure
`