

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