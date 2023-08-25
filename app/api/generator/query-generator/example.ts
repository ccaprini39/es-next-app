

const example =
{
  "explain": false,
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "name": "\\{\\n    \"data\": \"DAFFY DUCK\",\\n    \"entityType\": \"PERSON\"\\n\\}"
          }
        },
        {
          "match": {
            "dob": "19350119"
          }
        }
      ]
    }
  },
  "rescore": {
    "window_size": "${window_size}",
    "query": {
      "rescore_query": {
        "function_score": {
          "doc_score": {
            "fields": {
              "name": {
                "query_value": {
                  "data": "DAFFY DUCK",
                  "entityType": "PERSON"
                }
              },
              "dob": {
                "query_value": "19350119"
              }
            }
          }
        }
      },
      "query_weight": 0.0,
      "rescore_query_weight": 1.0
    }
  }
}

const example2 =
{
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
    "window_size": 100,
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
}

const example3 =
{
  "explain": false,
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "name": "\\{\\n    \"data\": \"ELMER FUDD\",\\n    \"entityType\": \"PERSON\"\\n\\}"
          }
        },
        {
          "match": {
            "dob": "19370714"
          }
        }
      ]
    }
  },
  "rescore": {
    "window_size": 100,
    "query": {
      "rescore_query": {
        "function_score": {
          "doc_score": {
            "fields": {
              "name": {
                "query_value": {
                  "data": "ELMER FUDD",
                  "entityType": "PERSON"
                }
              },
              "dob": {
                "query_value": "19370714"
              }
            }
          }
        }
      },
      "query_weight": 0.0,
      "rescore_query_weight": 1.0
    }
  }
}

const getVerboseRam = 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/nodes?h=ram*&v&pretty'
const getVerboseRamWithNodeName = 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/nodes?h=ram*&v&pretty&h=n'
const getDocCount = 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/indices?h=docs.count&v&pretty'

const deleteOneDoc = {
  "query": {
    "match_all": {}
  }
}


