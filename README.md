# Utils 🔍

> Utils functions and classes to any NodeJS project

[![GitHub followers](https://img.shields.io/github/followers/jlenon7.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/jlenon7?tab=followers)
[![GitHub stars](https://img.shields.io/github/stars/secjs/utils.svg?style=social&label=Star&maxAge=2592000)](https://github.com/secjs/utils/stargazers/)

<p>
    <a href="https://www.buymeacoffee.com/secjs" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

<p>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/secjs/utils?style=for-the-badge&logo=appveyor">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/secjs/utils?style=for-the-badge&logo=appveyor">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=appveyor">

  <img alt="Commitizen" src="https://img.shields.io/badge/commitizen-friendly-brightgreen?style=for-the-badge&logo=appveyor">
</p>

The intention behind this repository is to always maintain a `Utils` package with varied functions and classes to any NodeJS project.

<img src=".github/utils.png" width="200px" align="right" hspace="30px" vspace="100px">

## Installation

> To use the high potential from this package you need to install first this other packages from SecJS,
> it keeps as dev dependency because one day `@secjs/core` will install everything once.

```bash
npm install @secjs/contracts @secjs/exceptions
```

> Then you can install the package using:

```bash
npm install @secjs/utils
```

## Classes Usage

### File

> Use File to create an instance of a File, it's existing or not.

```ts
import { File } from '@secjs/utils'

// With file you can manipulate an existing file, or create a new one

const existentFile = new File('path/to/existent/file.txt')
const nonExistentFile = new File('path/to/nonExistent/file.txt', Buffer.from('File content'))

// Now existentFile and nonExistentFile instances are created, but not loaded/created

// using load here because the file already exists, if using create, would generate an exception
existentFile.loadSync({ withContent: true })
// property withContent if true, will save the file content in the instance, Be careful with big files
nonExistentFile.createSync().loadSync({ withContent: true })

// now the files will have this properties
console.log(existentFile.createdAt)
console.log(existentFile.accessedAt)
console.log(existentFile.modifiedAt)
console.log(existentFile.fileSize)
console.log(existentFile.content)

// you can delete the file using remove method
existentFile.removeSync() // void

// you can get the content of the file with getContent method
console.log(existentFile.getContentSync()) // Some Buffer instance

// you can use toJSON method to get the instance informations in JSON
console.log(existentFile.toJSON()) // { ...infos }

// you can make a copy from existentFile using copy
console.log(existentFile.copySync('path/to/copy.txt'))

// you can move existentFile to other path using move
console.log(existentFile.moveSync('path/to/move.txt'))

// File uses readable streams in async methods to not block the event loop when handling huge files content
await existentFile.load()
await existentFile.copy()
await existentFile.move()
await existentFile.remove()
await existentFile.create()
await existentFile.getContent()

// You can use safeRemove method to delete the file without any exception if it does no exists

await File.safeRemove(existentFile.path)
```

---

### Folder

> Use Folder to create an instance of a Folder, it's existing or not.

```ts
import { Folder } from '@secjs/utils'

// With folder you can manipulate an existing folder, or create a new one

const existentFolder = new Folder('path/to/existent/folder')
const nonExistentFolder = new Folder('path/to/nonExistent/folder')

// Now existentFolder and nonExistentFolder instances are created, but not loaded/created

// using load here because the file already exists, if using create, would generate an exception
existentFolder.loadSync({ withSub: true, withFileContent: false })

// property withSub if true, will load files and subFolders from the folder
// property withFileContent if true, will get the content of all files in the folder, Be careful with big files
nonExistentFolder.createSync().loadSync({ withSub: true, withFileContent: true })

// now the folders will have this properties
console.log(existentFolder.createdAt)
console.log(existentFolder.accessedAt)
console.log(existentFolder.modifiedAt)
console.log(existentFolder.folderSize)

// you can delete the folder using remove method
existentFolder.removeSync() // void

// you can use toJSON method to get the instance informations in JSON
console.log(existentFolder.toJSON()) // { ...infos }

// you can make a copy from existentFolder using copy
console.log(existentFolder.copySync('path/to/copy'))

// you can move existentFolder to other path using move
console.log(existentFolder.moveSync('path/to/move'))

// you can use getFilesByPattern method to get all files in the folder that match some pattern
// if recursive is true, will go inside subFolders too
const recursive = true
console.log(existentFolder.getFilesByPattern('**/*.ts', recursive)) // [...files instance]

// you can use getFoldersByPattern method to get all folders in the folder that match some pattern
console.log(existentFolder.getFoldersByPattern('**', recursive)) // [...folders instance]

// Folder uses readable streams in async methods to not block the event loop when handling huge files content
await existentFolder.load()
await existentFolder.copy()
await existentFolder.move()
await existentFolder.remove()
await existentFolder.create()

// You can use safeRemove method to delete the folder without any exception if it does no exists

await Folder.safeRemove(existentFile.path)
```

---

### Is

> Use Is to validate if value is from some type or is empty, is uuid, is cpf, is cep, etc...

```ts
import { Is } from '@secjs/utils'

// Is class is a validator. It validates if the value matches the name of the function and returns a boolean

Is.Empty('') // true
Is.Empty([]) // true
Is.Empty([1]) // false
Is.Empty({}) // true
Is.Empty({ hello: 'world' }) // false
Is.Empty(' ') // true
Is.Empty('hello') // false

Is.Ip('not-valid-ip') // false
Is.Uuid('not-valid-uuid') // false
Is.Cep('not-valid-cep') // false
Is.Cpf('not-valid-cpf') // false
Is.Cnpj('not-valid-cnpj') // false
Is.Async(() => {}) // false
Is.Async(async () => {}) // true
Is.Async(() => { new Promise((resolve => resolve())) }) // true

Is.String('value') // true
Is.Undefined('value') // false
Is.Null('value') // false
Is.Boolean('value') // false
Is.Buffer('value') // false
Is.Number('value') // false
Is.Object('value') // false
Is.Date('value') // false
Is.Array('value') // false
Is.Regexp('value') // false
Is.Error('value') // false
Is.Function('value') // false
Is.Class('value') // false
Is.Integer('value') // false
Is.Float('value') // false

Is.ArrayOfObjects('') // false
Is.ArrayOfObjects([1, 2, 3]) // false
Is.ArrayOfObjects([{ hello: 'world' }]) // true
```

---

### String

> Use String to generate random strings, normalizations and case changes

```ts
import { String } from '@secjs/utils'

// With String you can change the case of strings

const string = 'Hello world'
const capitalize = true

String.toCamelCase(string) // 'helloWorld'
String.toPascalCase(string) // 'HelloWorld'
String.toSnakeCase(string) // 'hello_world'
String.toDotCase(string) // 'hello.world'
String.toSentenceCase(string) // 'Hello world'
String.toNoCase(string) // 'hello world'
String.toDashCase(string) // 'hello-world'
String.toDashCase(string, capitalize) // 'Hello-World'

// You can generate random strings by size and random hexadecimal colors

String.generateRandom(10) // 'GpXuZScThi'
String.generateRandomColor() // '#d5063b'

// You can put a string in plural or in singular and in ordinal number

String.pluralize(string) // 'Hello worlds'
String.singularize(String.pluralize(string)) // 'Hello world'
String.ordinalize('1') // '1st'
String.ordinalize('2') // '2nd'
String.ordinalize('3') // '3rd'
String.ordinalize('10') // '10th'

// And you can also normalize base64 string

String.normalizeBase64('+++///===') // '---___'
```

---

### Path

> Use Path to get the absolute path from project folders.

```ts
import { Path } from '@secjs/utils'

// If NODE_TS is set to true, Path.pwd will always return without the build folder in the end of the path
Path.pwd() // '/home/your/computer/path/your-project-name'

// If NODE_TS is set to false, Path.pwd will always return with the build folder in the end of the path
Path.pwd() // '/home/your/computer/path/your-project-name/dist'

// You can use the method switchEnvVerify to turn off the NODE_TS environment variable verification
Path.switchEnvVerify()

// You can change the default build folder name using changeBuild method
Path.changeBuild('build') 
// '/home/your/computer/path/your-project-name/build'

// you can change your build folder name using forBuild method too
Path.forBuild('buildd').pwd()
// '/home/your/computer/path/your-project-name/buildd'

Path.pwd('/src/') // '/home/your/computer/path/your-project-name/build/src'

// You can use switchBuild to turn on or turn off the forceBuild parameter
// forceBuild on
Path.switchBuild().public() // '/home/your/computer/path/your-project-name/build/public'

// forceBuild off
Path.switchBuild().assets() // '/home/your/computer/path/your-project-name/public/assets'
```

---

### Json

> Use Json to parse json without errors, deep copy, observeChanges inside objects and more.

```ts
import { Json } from '@secjs/utils'

const textWithJsons = 'string with a Json inside of it {"text":"hello"} and one more Json {"hello":"world"}'

Json.getJson(textWithJsons) // ['{"text":"hello"}', '{"hello":"world"}']

const text = 'a string that is not a valid JSON'

Json.parse(text) // null
```

```ts
const object = {
  test: 'hello',
  hello: () => 'hy',
}

const objectCopy = Json.copy(object)

objectCopy.test = 'hello from copy'
objectCopy.hello = () => 'hy from copy'

console.log(object.test) // hello
console.log(object.hello()) // hy
console.log(objectCopy.test) // hello from copy
console.log(objectCopy.hello()) // hy from copy
```

```ts
const data = {}

const doSomething = (value, args) => {
  console.log(`Name changed to: ${value}`, args)
}

const args = {
  value: 'args are the same second parameter of doSomething function'
}

Json.observeChanges(data, 'name', doSomething, args)

data.name = 'João'

// Name changed to: João { value: 'args are the same second parameter of doSomething function' }

const object = {
  number1: 'good string',
  number2: 'bad string',
}

const readyToSaveOnDatabase = Json.fillable(object, ['number1'])

console.log(readyToSaveOnDatabase) // { number1: 'good string' }
```

```ts
const array = [1, 1, 2, 4, 4]

console.log(Json.removeDuplicated(array)) // [1, 2, 4]
```

```ts
const array = ['a', 'b', 'c'] // Array length = 2 (0, 1, 2)
const sortedValue =  Json.sort(array) // Sorted value from the array, could be a, b or c

console.log(sortedValue) // a, b or c
```

---

### Route

> Use Route to manipulate paths, getParams, getQueryParams, create route matcher RegExp etc.

```js
import { Route } from '@secjs/utils'

const absolutePath = '/tests/:id/users/:user_id'
const path = '/tests/1/users/2?page=1&limit=10'

Route.getQueryString(path) // ?page=1&limit=10
Route.removeQueryParams(path) // /tests/1/users/2
Route.getQueryParamsValue(path) // { page: '1', limit: '10' }
Route.getQueryParamsName(path) // ['path', 'limit']
Route.getParamsValue(absolutePath, path) // { id: '1', user_id: '10' }
Route.getParamsName(absolutePath) // ['id', 'user_id']

const regExpMatcher = Route.createMatcher(absolutePath) // /^(?:\/tests\b)(?:\/[\w-]+)(?:\/users\b)(?:\/[\w-]+)$/

regExpMatcher.test(path) // false - because of queryParams
regExpMatcher.test(Route.removeQueryParams(path)) // true
```

---

### Blacklist

> Use Blacklist to add, find and remove values from a blacklist/whitelist file

```js
import { Blacklist } from '@secjs/utils'

const blacklist = new Blacklist()

const filePath = 'blacklist.txt'

await blacklist.add('192.168.0.1', filePath) // void

// blacklist.txt value
// 192.168.0.1

await blacklist.add('192.168.0.2', filePath) // void

// blacklist.txt value
// 192.168.0.1
// 192.168.0.2

const valueFound = await blacklist.find('192.168.0.2', filePath) // Will return the value - 192.168.0.2

await blacklist.remove('192.168.0.2', filePath) // void

// blacklist.txt value
// 192.168.0.1
```

---

### Numbers

> Use Numbers to manipulate numbers the best way

```js
import { Numbers } from '@secjs/utils'

const arrayOfNumbers = [2, 4]
const stringNumber = "Hello my name is João, I'm 20 year old!"

console.log(Numbers.getLower(arrayOfNumbers)) // 2
console.log(Numbers.getHigher(arrayOfNumbers)) // 4

console.log(Numbers.extractNumber(stringNumber)) // '20'
console.log(Numbers.extractNumbers(stringNumber)) // ['20']

console.log(Numbers.argsAverage(2, 4)) // 3
console.log(Numbers.arrayAverage(arrayOfNumbers)) // 3
```

---

### Token

> Generate UUID tokens using a prefix, and validate it to using uuidv4 lib

```js
import { Token } from '@secjs/utils'

// Do not use the char "-", it would break token.verify() method
const uuidGeneratedToken = Token.generate('yourServicePrefix')
console.log(uuidGeneratedToken) // yourServicePrefix-c546b11c-2c2b-11eb-adc1-0242ac120002

const isUuid = Token.verify(uuidGeneratedToken)
console.log(isUuid) // true
```

---

### Parser

> Use Parser to parse all type of data of you application

```ts
import { Parser } from '@secjs/utils'

// Convert a string to array using a separator

const string1 = '1,2,3'
const separator = ','
const parsed1 = Parser.stringToArray(string1, separator)

console.log(parsed1) // ['1', '2', '3']
```

```ts
// Convert an array to string using separators

Parser.arrayToString(['1', '2', '3', '4']) // '1, 2, 3 and 4' 
Parser.arrayToString(['1', '2', '3', '4'], // '1|2|3-4'
  { separator: '|', lastSeparator: '-' }
)

// Pair separator is only for two indexes arrays
Parser.arrayToString(['1', '2'], { // '1_2'
  pairSeparator: '_',
})
```

```ts
const string2 = 'aaaasadzczaaa21313'
const parsed2 = Parser.stringToNumber(string2)

console.log(parsed2) // 21313
```

```ts
const object = {
  joao: 'joao',
  email: 'lenonsec7@gmail.com',
}
const parsed3 = Parser.jsonToFormData(object)

console.log(parsed3) // &joao=joao&email=lenonSec7%40gmail.com
```

```ts
const parsed4 = Parser.formDataToJson('?joao=joao&email=lenonSec7%40gmail.com')

console.log(parsed4) // { joao: 'joao', email: 'lenonsec7@gmail.com' }
```

```ts
const message = 'Link: https://google.com'
  
// Convert url to and HTML href

console.log(Parser.linkToHref(message)) // Link: <a href="https://google.com">https://google.com</a>
```

```ts
// Convert number size to bytes

Parser.sizeToByte(1024) // '1KB'
Parser.sizeToByte(1048576) // '1MB'
Parser.sizeToByte(1073741824) // '1GB'
Parser.sizeToByte(1099511627776) // '1TB'
Parser.sizeToByte(1125899906842624) // '1PB'

// Convert bytes to number size

Parser.byteToSize('1KB') // 1024
Parser.byteToSize('1MB') // 1048576
Parser.byteToSize('1GB') // 1073741824
Parser.byteToSize('1TB') // 1099511627776
Parser.byteToSize('1PB') // 1125899906842624
```

```ts
// Convert time string to ms

Parser.timeToMs('2 days') // 172800000
Parser.timeToMs('1d') // 86400000
Parser.timeToMs('10h') // 36000000
Parser.timeToMs('-10h') // -36000000
Parser.timeToMs('1 year') // 31557600000
Parser.timeToMs('-1 year') // -31557600000

// Convert ms to time string

const long = true 

Parser.msToTime(172800000, long) // '2 days'
Parser.msToTime(86400000) // 1d
Parser.msToTime(36000000) // 10h
Parser.msToTime(-36000000) // -10h
Parser.msToTime(31557600000, long) // 1 year
Parser.msToTime(-31557600000, long) // -1 year
```

---

### Clean

> Use Clean to clean arrays and objects

```js
import { Clean } from '@secjs/utils'

const array = [null, undefined, 1, "number"]

console.log(Clean.cleanArray(array)) // [1, "number"]

const object = {
  number1: "number",
  number2: null,
  number3: undefined,
  number4: 1,
}

const object2 = {
  number1: null,
  number2: [object],
}

console.log(Clean.cleanObject(object)) // { number1: "number", number4: 1 }
console.log(Clean.cleanArraysInObject(object2)) // { number2: [{ number1: "number", number4: 1 }]}
```

---

## Functions Usage

### getBranch

> Get the actual git branch that the project is running or not a repository.

```js
import { getBranch } from '@secjs/utils'

await getBranch() // master || Not a repository
```

---

### getCommitId

> Get the actual commit id from the local repository.

```js
import { getCommitId } from '@secjs/utils'

await getCommitId() // the commit sha || Not a repository
```

---

### download

> Download an archive/image to determined path.

```js
import { download } from '@secjs/utils'

;(async function () {
  const url =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/1.png'
  const pathToSave = `${process.cwd()}/tests`
  const imageName = '1.png'
  
  await download(url, imageName, pathToSave)
})()
```

---

### scheduler

> Use scheduler to execute some function based on MS

```js
import { scheduler } from '@secjs/utils'

const func = () => {
    console.log('Starting at...', new Date.toISOString())
}

scheduler(func, 3000) // scheduler function will execute the func every 3 seconds
```

---

### paginate

> Use paginate get meta and links from for response

```js
import { paginate } from '@secjs/utils'
import { PaginationContract } from '@secjs/contracts'

const filters = {
  where: { id: 1 }
}

const pagination: PaginationContract = {
  page: 1,
  limit: 10,
  resourceUrl: 'https://test/users'
}

const array = this.repository.getAll(pagination, filters)
const total = this.repository.count(filters)

console.log(paginate(array, total, pagination)) 

// { 
//    data: [{ id: 1, name: 'João Lenon' }], 
//    meta: {
//      itemCount: 1,
//      totalItems: 1, 
//      totalPages: 1,
//      currentPage: 0,
//      itemsPerPage: 10,
//    }, 
//    links: {
//      first: 'https://test/users?limit=10',
//      previous: 'https://test/users?page=0&limit=10',
//      next: 'https://test/users?page=2&limit=10',
//      last: 'https://test/users?page=1&limit=10',
//   } 
// }

```

---

### sleep

> Use sleep to let you code sleep for sometime

```js
import { sleep } from '@secjs/utils'

await sleep(2000) // Your code will stop in this line for two seconds
```

---

### kmRadius

> Find out what's the distance between a coordinate to other

```js
import { kmRadius, ICoordinate } from '@secjs/utils'

// Use type number for more precision,
// but you can use string to,
// kmRadius will handle it with Parser.
const coordinate1 {
 latitude: -25.4858841,
 longitude: -54.564615,
} as ICoordinate // ICoordinate will force numbers

const coordinate2 {
 latitude: '-54.564615',
 longitude: '-25.4858841',
}

const distance = await kmRadius(coordinate1, coordinate2)

console.log(distance) // The distance in Kilometers (KM)
```

---

## License

Made with 🖤 by [jlenon7](https://github.com/jlenon7) :wave:
