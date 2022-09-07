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

The intention behind this repository is to always maintain a `Utils` package with varied functions and classes to any
NodeJS project.

<img src=".github/utils.png" width="200px" align="right" hspace="30px" vspace="100px">

## Installation

```bash
npm install @secjs/utils
```

## Usage

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

// you can add content to the end of the file with append
console.log(existentFile.appendSync(Buffer.from('Content\n')))

// you can add content to the top of the file with prepend
console.log(existentFile.prependSync(Buffer.from('Content\n')))

// File uses readable streams in async methods to not block the event loop when handling huge files content
await existentFile.load()
await existentFile.copy()
await existentFile.move()
await existentFile.remove()
await existentFile.create()
await existentFile.append()
await existentFile.prepend()
await existentFile.getContent()

// You can use safeRemove method to delete the file without any exception if it does no exists
await File.safeRemove(existentFile.path)

// You can use isFileSync to verify if path is a file or directory
await File.isFileSync('package.json')

// You can use existsSync to verify if file exists
await File.existsSync('package.json')

// You can use createFileOfSize to create a fake file with determined size
// 100MB
await File.createFileOfSize('fake.js', 1024 * 1024 * 100)
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

// You can use isFolderSync to verify if path directory or file
await Folder.isFolderSync('path/to/folder')

// You can use existsSync to verify if folders exists
await Folder.existsSync('path/to/folder')
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

Is.Json('not-valid-json') // false
Is.Ip('not-valid-ip') // false
Is.Uuid('not-valid-uuid') // false
Is.Cep('not-valid-cep') // false
Is.Cpf('not-valid-cpf') // false
Is.Cnpj('not-valid-cnpj') // false
Is.Async(() => {
}) // false
Is.Async(async () => {
}) // true
Is.Async(() => {
  new Promise((resolve => resolve()))
}) // true

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
String.toNoCase(string) // 'hello world'
String.toConstantCase(string) // HELLO_WORLD
String.toDashCase(string) // 'hello-world'
String.toDashCase(string, capitalize) // 'Hello-World'
String.toDotCase(string) // 'hello.world'
String.toDotCase(string, capitalize) // 'Hello.World'
String.toSnakeCase(string) // 'hello_world'
String.toSnakeCase(string, capitalize) // 'Hello_World'
String.toSentenceCase(string) // 'Hello world'
String.toSentenceCase(string, capitalize) // 'Hello World'

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

### Exception

> Use exception to extend the Error object and create custom exceptions

```ts
import { Exception } from '@secjs/utils'

const content = 'An error has ocurred in your application!'
const status = 500
const code = 'APPLICATION_ERROR'
const help = 'Delete your code and start again'

const exception = new Exception(content, status, code, help)

const withStack = true
console.log(exception.toJSON(withStack))

/**
 * {
 *   code: 'APPLICATION_ERROR',
 *   status: 500,
 *   content: 'An error has ocurred in your application!',
 *   help: 'Delete your code and start again',
 *   stack: ...,
 * }
 */

console.log(await exception.prettify()) // Pretty exception log using Youch API
```

> Extending Exception helper

```ts
import { Exception } from '@secjs/utils'

export class InternalServerException extends Exception {
  public constructor(content = 'An internal server error has ocurred', status = 500) {
    super(content, status)
  }
}

throw new InternalServerException()
```

---

### Path

> Use Path to get the absolute path from project folders.

```ts
import { Path } from '@secjs/utils'

const subPath = '/hello'

Path.pwd(subPath, beforePath) // '/home/your/computer/path/your-project-name/hello'

// You can set a default before path for most Path methods 
Path.defaultBeforePath = 'build'

Path.pwd(subPath, beforePath) // '/home/your/computer/path/your-project-name/build/hello'

Path.pwd('/src/') // '/home/your/computer/path/your-project-name/build/src'
```

---

### Config

> Handle configurations files values inside your application ecosystem

```ts
// First you need to create your configuration file using the file template

// app.ts
export default {
  name: 'secjs'
}

// database.ts
export default {
  host: '127.0.0.1',
  port: Env('PORT', 5432),
  // You can use Config.get inside this config files and Config class will handle it for you
  database: Config.get('app.name')
}
```

> Loading configuration files and get then

```ts
// To load configuration files you need to create a instance of Config
const config = new Config()

// Loading database.ts will automatic load app.ts, because database.ts depends on app.ts
config.load('database.ts')

// So now we can get information of both

console.log(Config.get('app.name')) // 'secjs'
console.log(Config.get('database.port')) // 5432
console.log(Config.get('database.database')) // 'secjs'

// You can call load again and you will never lose the previous states
config.load('example.ts')

// You can also use safeLoad to not reload files that were already loaded
config.safeLoad('app.ts') // Will just return without errors, but app.ts will not be reloaded.

console.log(Config.get('app.name')) // 'secjs'
```

> Be careful with Config.get() in configuration files ⚠️🛑

```ts
// Lets create this two configuration files as example

// recursive-errorA.ts
export default {
  // Here we are using a property from recursive-errorB
  recursive: Config.get('recursive-errorB.recursive')
}

// recursive-errorB.ts
export default {
  // And here we are using a property from recursive-errorA
  recursive: Config.get('recursive-errorA.recursive')
}

// If you try to load any of this two files you will get an error from Config class
// Config class will start going file to file and she cant resolve any of then because one depends on the other
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
const raffledValue = Json.raffle(array) // Raffled value from the array, could be a, b or c

console.log(raffledValue) // a, b or c
```

```ts
const object = {
  hello: {
    world: {
      value: {
        hello: 'Hello World!',
      },
    },
  },
}

const value = Json.get(object, 'hello.world.value.hello') // 'Hello World!'
const undefinedValue = Json.get(object, 'hello.worlld.value.hello') // undefined
const defaultValue = Json.get(object, 'hello.worlld.value.hello', 'Hi World!') // 'Hi World!'
const fullObject = Json.get(object, '') // Same as object { hello: { world: { value: { hello: 'Hello World!' } } } }
const defaultValueInObjectNull = Json.get(undefined, '', { hello: 'world' }) // { hello: 'world' }
```

---

### Module

> Use Module to resolve modules exports, import modules using hrefs' ensuring compatibility between OS's, creating
> aliases for your modules exports and creating __filename and __dirname properties.

```ts
import { Module } from '@secjs/utils'

const module = await Module.get(import('#src/Helpers/Options'))

console.log(module.name) // Options
```

```ts
import { Module } from '@secjs/utils'

const modules = await Module.getAll([import('#src/Helpers/Number'), import('#src/Helpers/Options')])

console.log(modules[0].name) // Number
console.log(modules[1].name) // Options
```

```ts
import { Module } from '@secjs/utils'

const modules = await Module.getAllWithAlias([
  import('#src/Helpers/Number'),
  import('#src/Helpers/Options')
], 'App/Helpers')

console.log(modules[0].module.name) // Number
console.log(modules[0].alias) // 'App/Helpers/Number'

console.log(modules[1].module.name) // Options
console.log(modules[1].alias) // 'App/Helpers/Options'
```

```ts
import { Path, Module } from '@secjs/utils'

const module = await Module.getFrom(Path.config('app.js'))

console.log(module.name) // Athenna
console.log(module.description) // Athenna application
console.log(module.environment) // production
```

```ts
import { Path, Module } from '@secjs/utils'

const modules = await Module.getAllFromWithAlias(Path.config(), 'App/Configs')
const appConfigFile = module[0].module
const appConfigAlias = module[0].alias

console.log(appConfigAlias) // App/Configs/App
console.log(appConfigFile.name) // Athenna
console.log(appConfigFile.description) // Athenna application
console.log(appConfigFile.environment) // production
```

```ts
import { Module } from '@secjs/utils'

const setInGlobalTrue = true
const setInGlobalFalse = false

const dirname = Module.createDirname(import.meta.url, setInGlobalFalse)
const filename = Module.createFilename(import.meta.url, setInGlobalTrue)

console.log(__dirname) // Error! __dirname is not defined in global
console.log(__filename) // '/Users/...'
```

---

### Route

> Use Route to manipulate paths, getParams, getQueryParams, create route matcher RegExp etc.

```ts
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

### Number

> Use Number to manipulate numbers the best way

```ts
import { Number } from '@secjs/utils'

const arrayOfNumbers = [2, 4]
const stringNumber = "Hello my name is João, I'm 20 year old!"

// Get the lower/higher number from the array
console.log(Number.getLower(arrayOfNumbers)) // 2
console.log(Number.getHigher(arrayOfNumbers)) // 4

// Extract numbers from strings
console.log(Number.extractNumber(stringNumber)) // '20'
console.log(Number.extractNumbers(stringNumber)) // ['20']

// Return the average from infinite parameters or array of numbers
console.log(Number.argsAverage(2, 4)) // 3
console.log(Number.arrayAverage(arrayOfNumbers)) // 3

// Generate random integers values between interval
console.log(Number.randomIntFromInterval(1, 1)) // 1
console.log(Number.randomIntFromInterval(1, 2)) // 1
console.log(Number.randomIntFromInterval(1, 2)) // 2
console.log(Number.randomIntFromInterval(1, 10)) // 8

```

---

### Token

> Generate U UID tokens using a prefix, and validate it to using uuidv4 lib

```ts
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

```ts
// Convert status code to reason

Parser.statusCodeToReason(200) // OK
Parser.statusCodeToReason('201') // CREATED
Parser.statusCodeToReason(404) // NOT_FOUND
Parser.statusCodeToReason('500') // INTERNAL_SERVER_ERROR

// Convert reason to status code

Parser.reasonToStatusCode('OK') // 200
Parser.reasonToStatusCode('created') // 201
Parser.reasonToStatusCode('NOT_found') // 404
Parser.reasonToStatusCode('internal server error') // 500
```

```ts
const url =
  'postgresql://postgres:root@127.0.0.1:5432/postgres?paramOne=1&paramTwo=2&paramThree=3'

// Convert database connection url to connection object
const connectionObject = Parser.dbUrlToConnectionObj(url)

/** connectionObject result
 * {
 *   protocol: 'postgresql',
 *   user: 'postgres',
 *   password: 'root',
 *   host: '127.0.0.1',
 *   port: 5432,
 *   database: 'postgres',
 *   options: {
 *     paramOne: '1',
 *     paramTwo: '2',
 *     paramThree: '3',
 *   }
 * }
 */

// Convert connection object to database connection url
const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

/** connectionUrl result
 * postgresql://postgres:root@127.0.0.1:5432/postgres?paramOne=1&paramTwo=2&paramThree=3
 */
```

---

### Clean

> Use Clean to clean arrays and objects

```ts
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

### Debug

> Use Debug to generate debug logs in SecJS format

```ts
import { Debug } from '@secjs/utils'

const context = 'API'
const namespace = 'api:main'

const debug = new Debug(context, namespace)

// You can still change the context/namespace of the instance in runtime
debug
  .buildContext(context)
  .buildNamespace(namespace)
  .log('Hello World!') // api:main [SecJS Debugger] - PID: 85580 - 02/15/2022, 11:47:56 AM [API] Hello World! +0ms

// You can log objects too, it will be converted to string in the formatter
debug
  .buildContext('Object')
  .buildNamespace('api:object')
  .log({ hello: 'world' }) // api:object [SecJS Debugger] - PID: 85770 - 02/15/2022, 11:53:48 AM [Object] {"hello":"world"} +0ms
```

---

Made with 🖤 by [jlenon7](https://github.com/jlenon7) :wave:
