import { NextResponse } from "next/server"
import crypto from 'crypto'



//this endpoint will generate 500 documents with random data and index them into the index
//http://localhost:3000/bulk-index
//the response will be true if the indexing was successful, false otherwise

export async function GET(request: Request) {
  let response: any
  try {
    const res = await indexNDocs(1000)
    if (res.status === 200) {
      const json = await res.json()
      response = json
    } else {
      response = { success: false }
    }
  } catch (error: any) {
    console.error(error)
    response = { error: 'error' }
  }
  return NextResponse.json(response)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { n } = body
  let response: any
  try {
    if (n < 10000) {
      const res = await indexNDocs(n)
      if (res.status === 200) {
        const json = await res.json()
        response = json
      } else {
        response = { success: false }
      }
    }
    else {
      //divide it by 1000 and then index 10000 docs at a time
      const numOfIterations = Math.floor(n / 10000)
      for (let i = 0; i < numOfIterations; i++) {
        const res = await indexNDocs(10000)
        if (res.status === 200) {
          const json = await res.json()
          response = json
        } else {
          response = { success: false }
        }
      }
    }
  }
  catch (error: any) {
    console.error(error)
    response = { error: 'error' }
  }

  return NextResponse.json(response)
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
  let monthString: string = month.toString()
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


//this function will generate a bulk string that can be used to index a document into elasticsearch
function generateBulkStringName() {
  const name = getRandomName()
  const dob = generateRandomDate()
  const ucn = generateUuid()
  const rniNameObject = {
    name: {
      "data": name,
      "entityType": "PERSON"
    },
    dob: dob,
    ucn: ucn
  }
  const bulkString = `{"index":{"_index":"performance_test"}}\n${JSON.stringify(rniNameObject)}\n`

  return bulkString
}

async function indexNDocs(n: number) {
  let bulkString = ''
  for (let i = 0; i < n; i++) {
    bulkString += generateBulkStringName() + '\n'
  }
  const res = await fetch(`https://localhost:9200/_bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + process.env.ES_AUTH
    },
    body: bulkString,
    cache: 'no-cache'
  })
  return res
}

const curl = `
curl -X POST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' -d'
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
'

`