# Utils 🔍

> Utils functions and classes to any NodeJS project

[![GitHub followers](https://img.shields.io/github/followers/jlenon7.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/jlenon7?tab=followers)
[![GitHub stars](https://img.shields.io/github/stars/secjs/utils.svg?style=social&label=Star&maxAge=2592000)](https://github.com/secjs/utils/stargazers/)

<p>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/secjs/utils?style=for-the-badge&logo=appveyor">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/secjs/utils?style=for-the-badge&logo=appveyor">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=appveyor">
</p>

The intention behind this repository is to always maintain a `Utils` package with varied functions and classes to any NodeJS project.

<img src=".github/utils.png" width="200px" align="right" hspace="30px" vspace="100px">

## Installation

```bash
yarn add @secjs/utils
```

## Classes Usage

### Numbers

> Use Numbers to manipulate numbers the best way

```js
import { Numbers } from '@secjs/core/utils'

const numbers = new Numbers()

const arrayOfNumbers = [2, 4]
const stringNumber = "Hello my name is João, I'm 20 year old!"

console.log(numbers.getLower(arrayOfNumbers)) // 2
console.log(numbers.getHigher(arrayOfNumbers)) // 4

console.log(numbers.extractNumber(stringNumber)) // '20'
console.log(numbers.extractNumbers(stringNumber)) // ['20']

console.log(numbers.argsAverage(2, 4)) // 3
console.log(numbers.arrayAverage(arrayOfNumbers)) // 3
```

---

### Token

> Generate UUID tokens using a prefix, and validate it to using uuidv4 lib

```js
import { Token } from '@secjs/core/utils'

const token = new Token()

// Do not use the char "-", it would break token.verify() method
const uuidGeneratedToken = token.generate('yourServicePrefix')
console.log(uuidGeneratedToken) // yourServicePrefix-c546b11c-2c2b-11eb-adc1-0242ac120002

const isUuid = token.verify(uuidGeneratedToken)
console.log(isUuid) // true
```

---

### Parser

> Use Parser to parse all type of data of you application

```js
import { Parser } from '@secjs/core/utils'

const parser = new Parser()

const string1 = '1,2,3'
const parsed1 = parser.stringToArray(string1)

console.log(parsed1) // ['1', '2', '3']

const string2 = 'aaaasadzczaaa21313'
const parsed2 = parser.stringToNumber(string2)

console.log(parsed2) // 21313

const object = {
  joao: 'joao',
  lenon: 'lenon',
}
const parsed3 = parser.jsonToFormData(object)
const parsed4 = parser.jsonToQueryString(object)

console.log(parsed3) // &joao=joao&lenon=lenon
console.log(parsed4) // ?joao=joao&lenon=lenon
```

---

### Clean

> Use Clean to clean arrays and objects

```js
import { Clean } from '@secjs/core/utils'

const clean = new Clean()

const array = [null, undefined, 1, "number"]

console.log(clean.cleanArray(array)) // [1, "number"]

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

console.log(clean.cleanObject(object)) // { number1: "number", number4: 1 }
console.log(clean.cleanArraysInObject(object2)) // { number2: [{ number1: "number", number4: 1 }]}
```

---

## Functions Usage

### observeChanges

> Use observeChanges to observe changes in the value of an object

```js
import { observeChanges } from '@secjs/core/utils'

const data = {}

const doSomething = (value, args) => {
  console.log(`Name changed to: ${value}`, args)
}

const args = {
  value: 'args are the same second parameter of doSomething function'
}

observeChanges(data, 'name', doSomething, args)

data.name = 'João'

// Name changed to: João { value: 'args are the same second parameter of doSomething function' }
```

### removeDuplicated

> Use removeDuplicated to remove duplicated values from an Array

```js
import { removeDuplicated } from '@secjs/core/utils'

const array = [1, 1, 2, 4, 4]

console.log(removeDuplicated(array)) // [1, 2, 4]
```

### randomColor

> Use randomColor to generate a random Hexadecimal color

```js
import { randomColor } from '@secjs/core/utils'

console.log(randomColor()) // #7059c1
```

### isArrayOfObjects

> Use isArrayOfObjects to verify if all values inside of the array are objects

```js
import { isArrayOfObjects } from '@secjs/core/utils'

const array1 = [1, 2, 3]
const array2 = [{ foo: 'bar' }, 2, 'string']
const array3 = [{ foo: 'bar' }]

const fakeArray = { foo: 'bar' }

console.log(isArrayOfObjects(array1)) // false
console.log(isArrayOfObjects(array2)) // false
console.log(isArrayOfObjects(array3)) // true

console.log(isArrayOfObjects(fakeArray)) // false
```

### urlify

> Use urlify to inject some URL of a string inside a HTML Link

```js
import { urlify } from '@secjs/core/utils'

const message = 'Link: https://google.com'

console.log(urlify(message)) // Link: <a href="https://google.com">https://google.com</a>
```

---

### scheduler

> Use scheduler to execute some function based on MS

```js
import { scheduler } from '@secjs/core/utils'

const func = () => {
    console.log('Starting at...', new Date.toISOString())
}

scheduler(func, 3000) // scheduler function will execute the func every 3 seconds
```

---

### paginate

> Use paginate get meta and links from for response

```js
import { paginate } from '@secjs/core/utils'
import { PaginationContract } from '@secjs/core/contracts'

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

### fillable

> Use fillable to return the array reduced by keys

```js
import { fillable } from '@secjs/core/utils'

const object = {
  number1: 'good string',
  number2: 'bad string',
}

const readyToSaveOnDatabase = fillable(object, ['number1'])

console.log(readyToSaveOnDatabase) // { number1: 'good string' }
```

---

### random

> Use random to generate random strings by the length you want using crypto

```js
import { random } from '@secjs/core/utils'

const randomStringWith10Chars = await random(10)

console.log(randomStringWith10Chars) // qwiortlkps
```

---

### sleep

> Use sleep to let you code sleep for sometime

```js
import { sleep } from '@secjs/core/utils'

await sleep(2000) // Your code will stop in this line for two seconds
```

---

### sort

> Use sort to get a sorted value from an array

```js
import { sort } from '@secjs/core/utils'

const array = ['a', 'b', 'c'] // Array length = 2 (0, 1, 2)
const index = sort(array) // Sorted index value, could only be 0, 1 or 2

console.log(array[index]) // a, b or c
```

---

### kmRadius

> Find out what's the distance between a coordinate to other

```js
import { kmRadius, ICoordinate } from '@secjs/core/utils'

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

### isCpf

> Validate if is a valid CPF Document or not.

```js
import { isCpf } from '@secjs/core/utils'

// CPF (911.881.600-28) Generated using https://4devs.com.br

console.log(isCpf(91188160028)) // true
console.log(isCpf("91188160028")) // true
console.log(isCpf("911.881.600-28")) // true

console.log(isCpf("911.881.600-29")) // false
console.log(isCpf("000.000.000-00")) // false
```

---

### isCnpj

> Validate if is a valid CNPJ Document or not.

```js
import { isCnpj } from '@secjs/core/utils'

// CNPJ (77.111.157/0001-19) Generated using https://4devs.com.br

console.log(isCnpj(77111157000119)) // true
console.log(isCnpj("77111157000119")) // true
console.log(isCnpj("77.111.157/0001-19")) // true

console.log(isCnpj("77.111.157/0001-20")) // false
console.log(isCnpj("00.000.000/0000-00")) // false
```

---
