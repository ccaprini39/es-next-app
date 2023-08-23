import { NextResponse } from "next/server"
import crypto from 'crypto'


export async function GET() {

  const url = 'https://localhost:9200/performance_test/_search'

  const queryObject : string = generateRandomQueryObject()

  const response = await fetch(url, {
    method: 'POST',
    body: queryObject,
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    }
  })

  const stringOfResponse = JSON.stringify(await response.json())
  const completeResponse = {
    query: JSON.stringify(JSON.parse(queryObject), null, 2),
    response: JSON.stringify(JSON.parse(stringOfResponse), null, 2)
  }

  return NextResponse.json(completeResponse)
}

export async function POST(request : Request) {
  const requestBody = await request.json() as queriesRequest
  const { index, warmup, numOfQueries } = requestBody

  if (warmup === true) await runWarmup(index)
  const tooks : number[] = await runNQueriesGetNTooks(index, numOfQueries)
  const averageTook = analyzeData(tooks)

  return NextResponse.json({tooks : tooks, averageTook : averageTook})
}

function analyzeData(data : number[]){
  const sum = data.reduce((a, b) => a + b, 0)
  const average = sum / data.length
  return average
}

async function runWarmup(index : string){
  for await ( const item of Array(10).keys() ) {
    await runQueryVoid(index)
  }
}

async function runQueryVoid(index : string){
  const queryObject : string = generateRandomQueryObject()
  const url = `https://localhost:9200/${index}/_search`
  await fetch(url, {
    method: 'POST',
    body: queryObject,
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    }
  })
}

async function runNQueriesGetNTooks(index : string, number : number){
  const resultsArray : number[] = []
  for await ( const item of Array(number).keys() ) {
    const took = await runQueryGetTook(index)
    resultsArray.push(took)
  }
  return resultsArray
}

async function runQueryGetTook(index : string) {
  const queryObject : string = generateRandomQueryObject()
  const url = `https://localhost:9200/${index}/_search`
  const response = await fetch(url, {
    method: 'POST',
    body: queryObject,
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    }
  })
  const responseJson = await response.json()
  return responseJson.took
}

const defaultRequest = 
{
  index : "performance_test",
  warmup : true,
  numOfQueries: 10
}

interface queriesRequest {
  index : string
  warmup : boolean
  numOfQueries : number
}

interface queriesResponse {
  averageTook : number
}


const arrayOfCommonMaleNames = [
  'James', 'John', 'Robert', 'Michael', 'William',
  'David', 'Richard', 'Charles', 'Joseph', 'Thomas',
  'Christopher', 'Daniel', 'Paul', 'Mark', 'Donald',
  'George', 'Kenneth', 'Steven', 'Edward', 'Brian',
  'Ronald', 'Anthony', 'Kevin', 'Jason', 'Matthew',
  'Gary', 'Timothy', 'Jose', 'Larry', 'Jeffrey', 'Frank',
  'Scott', 'Eric', 'Stephen', 'Andrew', 'Raymond', 'Gregory',
  'Joshua', 'Jerry', 'Dennis', 'Walter', 'Patrick', 'Peter',
  'Harold', 'Douglas', 'Henry', 'Carl', 'Arthur', 'Ryan',
  'Roger', 'Joe', 'Juan', 'Jack', 'Albert', 'Jonathan',
  'Justin', 'Terry', 'Gerald', 'Keith', 'Samuel', 'Willie',
  'Ralph', 'Lawrence', 'Nicholas', 'Roy', 'Benjamin', 'Bruce',
  'Brandon', 'Adam', 'Harry', 'Fred', 'Wayne', 'Billy',
  'Steve', 'Louis', 'Jeremy', 'Aaron', 'Randy', 'Howard',
  'Eugene', 'Carlos', 'Russell', 'Bobby', 'Victor', 'Martin',
  'Ernest', 'Phillip', 'Todd', 'Jesse', 'Craig', 'Alan',
  'Shawn', 'Clarence', 'Sean', 'Philip', 'Chris', 'Johnny',
  'Earl', 'Jimmy', 'Antonio', 'Danny', 'Bryan', 'Tony',
  'Luis', 'Mike', 'Stanley', 'Leonard', 'Nathan', 'Dale',
  'Manuel', 'Rodney', 'Curtis', 'Norman', 'Allen', 'Marvin',
  'Vincent', 'Glenn', 'Jeffery', 'Travis', 'Jeff', 'Chad',
  'Jacob', 'Lee', 'Melvin', 'Alfred', 'Kyle', 'Francis',
  'Bradley', 'Jesus', 'Herbert', 'Frederick', 'Ray', 'Joel',
  'Edwin', 'Don', 'Eddie', 'Ricky', 'Troy', 'Randall',
  'Barry', 'Alexander', 'Bernard', 'Mario', 'Leroy', 'Francisco',
  'Marcus', 'Micheal', 'Theodore', 'Clifford', 'Miguel', 'Oscar',
  'Jay', 'Jim', 'Tom', 'Calvin', 'Alex', 'Jon', 'Ronnie',
  'Bill', 'Lloyd', 'Tommy', 'Leon', 'Derek', 'Warren', 'Darrell',
  'Jerome', 'Floyd', 'Leo', 'Alvin', 'Tim', 'Wesley', 'Gordon',
  'Dean', 'Greg', 'Jorge', 'Dustin', 'Pedro', 'Derrick', 'Dan',
  'Lewis', 'Zachary', 'Corey', 'Herman', 'Maurice', 'Vernon',
  'Roberto', 'Clyde', 'Glen', 'Hector', 'Shane', 'Ricardo',
  'Sam', 'Rick', 'Lester', 'Brent', 'Ramon', 'Charlie', 'Tyler',
  'Gilbert', 'Gene', 'Marc', 'Reginald', 'Ruben', 'Brett',
]
const lengthOfCommonMaleNames = arrayOfCommonMaleNames.length

const arrayOfCommonFemaleNames = [
  'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth',
  'Jennifer', 'Maria', 'Susan', 'Margaret', 'Dorothy',
  'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen',
  'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon',
  'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah',
  'Jessica', 'Shirley', 'Cynthia', 'Angela', 'Melissa', 'Brenda',
  'Amy', 'Anna', 'Rebecca', 'Virginia', 'Kathleen', 'Pamela',
  'Martha', 'Debra', 'Amanda', 'Stephanie', 'Carolyn', 'Christine',
  'Marie', 'Janet', 'Catherine', 'Frances', 'Ann', 'Joyce',
  'Diane', 'Alice', 'Julie', 'Heather', 'Teresa', 'Doris',
  'Gloria', 'Evelyn', 'Jean', 'Cheryl', 'Mildred', 'Katherine',
  'Joan', 'Ashley', 'Judith', 'Rose', 'Janice', 'Kelly',
  'Nicole', 'Judy', 'Christina', 'Kathy', 'Theresa', 'Beverly',
  'Denise', 'Tammy', 'Irene', 'Jane', 'Lori', 'Rachel',
  'Marilyn', 'Andrea', 'Kathryn', 'Louise', 'Sara', 'Anne',
  'Jacqueline', 'Wanda', 'Bonnie', 'Julia', 'Ruby', 'Lois',
  'Tina', 'Phyllis', 'Norma', 'Paula', 'Diana', 'Annie',
  'Lillian', 'Emily', 'Robin', 'Peggy', 'Crystal', 'Gladys',
  'Rita', 'Dawn', 'Connie', 'Florence', 'Tracy', 'Edna',
  'Tiffany', 'Carmen', 'Rosa', 'Cindy', 'Grace', 'Wendy',
  'Victoria', 'Edith', 'Kim', 'Sherry', 'Sylvia', 'Josephine',
  'Thelma', 'Shannon', 'Sheila', 'Ethel', 'Ellen', 'Elaine',
  'Marjorie', 'Carrie', 'Charlotte', 'Monica', 'Esther', 'Pauline',
  'Emma', 'Juanita', 'Anita', 'Rhonda', 'Hazel', 'Amber',
  'Eva', 'Debbie', 'April', 'Leslie', 'Clara', 'Lucille',
  'Jamie', 'Joanne', 'Eleanor', 'Valerie', 'Danielle', 'Megan',
  'Alicia', 'Suzanne', 'Michele', 'Gail', 'Bertha', 'Darlene',
  'Veronica', 'Jill', 'Erin', 'Geraldine', 'Lauren', 'Cathy',
  'Joann', 'Lorraine', 'Lynn', 'Sally', 'Regina', 'Erica',
  'Beatrice', 'Dolores', 'Bernice', 'Audrey', 'Yvonne', 'Annette',
  'June', 'Samantha', 'Marion', 'Dana', 'Stacy', 'Ana',
  'Renee', 'Ida', 'Vivian', 'Roberta', 'Holly', 'Brittany',
  'Melanie', 'Loretta', 'Yolanda', 'Jeanette', 'Laurie', 'Katie',
  'Kristen', 'Vanessa', 'Alma', 'Sue', 'Elsie', 'Beth',
  'Jeanne', 'Vicki', 'Carla', 'Tara', 'Rosemary', 'Eileen',
  'Terri', 'Gertrude', 'Lucy', 'Tonya', 'Ella', 'Stacey',
  'Wilma', 'Gina', 'Kristin', 'Jessie', 'Natalie', 'Agnes',
  'Vera', 'Willie', 'Charlene', 'Bessie', 'Delores', 'Melinda',
  'Pearl', 'Arlene', 'Maureen', 'Colleen', 'Allison', 'Tamara',
]
const lengthOfCommonFemaleNames = arrayOfCommonFemaleNames.length

const arrayOfCommonLastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown',
  'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
  'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
  'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker',
  'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright',
  'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker',
  'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts',
  'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards',
  'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed'
]
const lengthOfCommonLastNames = arrayOfCommonLastNames.length

const arrayOfGenders = [
  'male', 'female'
]

function getRandomGender() {
  return arrayOfGenders[Math.floor(Math.random() * arrayOfGenders.length)]
}

function getRandomGivenName(gender: string) {
  if (gender === 'male') return getRandomMaleName()
  else return getRandomFemaleName()
}

function getRandomMaleName() {
  return arrayOfCommonMaleNames[Math.floor(Math.random() * lengthOfCommonMaleNames)]
}

function getRandomFemaleName() {
  return arrayOfCommonFemaleNames[Math.floor(Math.random() * lengthOfCommonFemaleNames)]
}

function getRandomLastName() {
  return arrayOfCommonLastNames[Math.floor(Math.random() * lengthOfCommonLastNames)]
}

function getRandomName() {
  const gender = getRandomGender()
  const numOfNames = generateRandomNumber(1, 3)
  let name = ''
  for (let i = 0; i < numOfNames; i++) {
    name += getRandomGivenName(gender) + ' '
  }
  name += getRandomLastName()
  return name
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

//now I need to generate random dates of the format yyyy-MM-dd
//I will generate a random year between 1900 and 2021
//then a random month between 1 and 12
//then a random day between 1 and 28, 29, 30, or 31 depending on the month
//then I will return the date in the format yyyy-MM-dd
function generateRandomDate() {
  const year = generateRandomNumber(1900, 2021)
  let month: number = generateRandomNumber(1, 13)
  let monthString : string = month.toString()
  //need to make sure that the number is expressed as a string with two digits
  if (month < 10) monthString = '0' + month
  let day: string | number = getRandomDayForMonth(month)
  //need to make sure that the number is expressed as a string with two digits
  if (day < 10) day = '0' + day
  return `${year}${monthString}${day}`
}

function getRandomDayForMonth(month: number) {
  if (month === 2) return generateRandomNumber(1, 29)
  else if (month === 4 || month === 6 || month === 9 || month === 11) return generateRandomNumber(1, 31)
  else return generateRandomNumber(1, 32)
}

/**
 * function for generating a uuid
 * @returns a uuid
 */
function generateUuid() {
  return crypto.randomBytes(16).toString("hex")
}

function generateRandomPerson() {
  const name = getRandomName()
  const dob = generateRandomDate()
  const ucn = generateUuid()
  return { name, dob, ucn }
}

function generateRandomQueryObject() : string{
  const {name, dob, ucn} = generateRandomPerson()
  const queryObject = {
    "explain": false,
    "query": {
      "bool": {
        "should": [
          {
            "match": {
              "name": JSON.stringify({ "data": name, "entityType": "PERSON" })
            }
          },
          {
            "match": {
              "dob": dob
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
                    "data": name,
                    "entityType": "PERSON"
                  },
                  "weight": 1
                },
                "dob": {
                  "query_value": dob,
                  "weight": 2.031
                }
              }
            }
          }
        },
        "query_weight": 0,
        "rescore_query_weight": 1
      }
    }
  }

  return JSON.stringify(queryObject)
}


const sampleQuery =
{
  "explain": false,
  "query": {
    "bool": {
      "_name": "J87ukijm8987457698kie",
      "should": [
        {
          "match": {
            "name": { "data": "DAFFY DUCK", "entityType": "PERSON" }
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
    "query": {
      "rescore_query": {
        "function_score": {
          "doc_score": {
            "fields": {
              "name": {
                "query_value": {
                  "data": "DAFFY DUCK",
                  "entityType": "PERSON"
                },
                "weight": 1
              },
              "dob": {
                "query_value": "19350119",
                "weight": 2.031
              }
            }
          }
        }
      },
      "query_weight": 0,
      "rescore_query_weight": 1
    }
  }
}

const sampleResponse = {
  "took": 1510,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": 0.5743536,
    "hits": [
      {
        "_index": "biog_identity",
        "_id": "inI_y4kBCxdT9-831qws",
        "_score": 0.5743536,
        "_source": {
          "ucn": "2145069HHT",
          "name": {
            "data": "DANIEL SMITH",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19650809"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "aYC0y4kBCxdT9-83JMbJ",
        "_score": 0.564639,
        "_source": {
          "ucn": "46675THJH",
          "name": {
            "data": "DANIEL TOMATOES",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19440508"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "BVVLy4kBq6JCp_xchA-g",
        "_score": 0.5618414,
        "_source": {
          "ucn": "589TTP520",
          "name": {
            "data": "DANIEL JACKSON",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19680504"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "BlVLy4kBq6JCp_xchA-g",
        "_score": 0.5618414,
        "_source": {
          "ucn": "625487BBB",
          "name": {
            "data": "DANIEL DAY LEWIS",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19680906"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "_1VLy4kBq6JCp_xchA6g",
        "_score": 0.537529,
        "_source": {
          "ucn": "6896524TT",
          "name": {
            "data": "DANIEL WEBFOOT",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19580906"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "AFVLy4kBq6JCp_xchA-g",
        "_score": 0.537529,
        "_source": {
          "ucn": "635874PPPL",
          "name": {
            "data": "DANIEL DUCK",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19650201"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "-kdjx4kBCxdT9-83mdaE",
        "_score": 0.516394,
        "_source": {
          "ucn": "5G76MGG",
          "name": {
            "data": "DANIEL O RILEY",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19480522"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "BFVLy4kBq6JCp_xchA-g",
        "_score": 0.4948338,
        "_source": {
          "ucn": "25897UWKL",
          "name": {
            "data": "DANIEL D OCONNOR",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19870502"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "_lVLy4kBq6JCp_xchA6g",
        "_score": 0.4705214,
        "_source": {
          "ucn": "6386YMU8",
          "name": {
            "data": "DANNY NOONAN",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19890602"
        }
      },
      {
        "_index": "biog_identity",
        "_id": "Kjt2yIkBq6JCp_xc2XwP",
        "_score": 0.4658028,
        "_source": {
          "ucn": "3170675GH",
          "name": {
            "data": "DANNY BOY FLOYD",
            "language": "eng",
            "entityType": "PERSON"
          },
          "dob": "19330102"
        }
      }
    ]
  }
}


const query =
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
    "window_size": 10,
    "query": {
      "rescore_query": {
        "function_score": {
          "doc_score": {
            "fields": {
              "name": {
                "query_value": {
                  "data": "DAFFY DUCK",
                  "entityType": "PERSON"
                },
                "weight": 1
              },
              "dob": {
                "query_value": "19350119",
                "weight": 2.031
              }
            }
          }
        }
      },
      "query_weight": 0,
      "rescore_query_weight": 1
    }
  }
}