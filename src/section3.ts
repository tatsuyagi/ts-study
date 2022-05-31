/**
 * 3章 型について
 */

/**
 * 型(type) ・・・ 値と、それを使ってできる事柄の集まり
 * 例)
 *   boolean: ブール値(true/false)とそれらについて行うことができる演算(||, &&, !など)の集まり
 *   number: 全ての数値とそれらについて行うことができる演算(+, -, *, /, %など)の集まり
 */

// TypeScriptで利用できる型

function squareOf(n: number) { // Type annotation: 明示的な型の指定
  return n * n
}

// any(TypeScriptが分からない場合のデフォルトの型)
{
  let a: any = 1
  let b: any = 'a'
  let c = a + b
}

// unknown
{
  const a: unknown = 30
  const b = a === 123
  // const c = a + 10  // error! 特定の型を想定した演算は行えない
  if (typeof a === 'number') {
    const d  = a + 10 // 型の絞り込みが行われているので演算ができる
  }
}

// boolean
{
  let a = true // boolean
  var bool_b = false // boolean
  const c = true // true <- 再代入不可なのでtrue型で確定する
  let d: boolean = true // boolean
  let e: true = true // true  <- リテラル型
  // let f: true = false // error! <- リテラル型なので、他の値は受け付けない
}

// number
// 整数、浮動小数点数、正数、負数、Infinity（無限大）、NaN（非数）など
{
  let a = 1234 // number
  var num_b = Infinity * 0.10 // number
  const c = 5678 // number
  let d = a < num_b // boolean
  let e: number = 100 // number
  let f: 26.218 = 26.218 // 26.218
  // let g: 26.218 = 10 // error!

  // 大きな数値を区切りで読みやすくできる
  let oneMillion = 1_000_000 // 1000000と同じ
  let twoMillion: 2_000_000 = 2_000_000
}

// bigint(丸めのエラーに遭遇することなく、大きな正数を扱える)
// サポートされているか確認が必要(ES2020以上)
{
  let a = 1234n // bigint
  const b = 5678n // 5678n
  var big_c = a + b // bigint
  let d = a < 1235 // boolean
  // let e = 88.5n // error! bigintリテラルは整数でなければいけない
  let f: bigint = 100n // bigint
  let g: 100n = 100n // 100n
  // let n: bigint = 100 // error! <- 型100を型bigintに割り当て不可
}

// symbol(ES2015で導入)
{
  let a = Symbol('a')
  let b: symbol = Symbol('b')
  var sym_c = a === b // boolean
  // let d = a + 'x' // +演算子の適用不可

  // unique symbol
  // リテラル型のようなもの（他の値と等しくならない）
  const e = Symbol('e') // typeof e
  const f: unique symbol = Symbol('f') // typeof f
  // let g: unique symbol = Symbol('f') // error <- constじゃないとダメ
  let h = e === e // boolean
  // let i = e === f // error <- 常にfalse
}

// オブジェクト
// 構造的型付け strucrural typing
{
  let a: object = {
    b: 'x'
  }

  // a.b // error!!

  // オブジェクトリテラル表記
  let b = {
    bb: 'x'
  }
  b.bb // string

  let c = {
    cc: {
      d: 'f'
    }
  } // {cc: {d: string}}

  let d: {f: number, g: bigint} = {
    f: 12,
    g: 120n
  }

  const e: {ee: number} = {
    ee: 12
  } // constで定義しても{ee: number} のまま リテラル型にならない
  // オブジェクトは変更可能だから
  e.ee = 120 // 再代入可能

  let f: {
    firstName: string
    lastName: string
  } = {
    firstName: 'john',
    lastName: 'barrowman'
  }

  class Person {
    constructor(
      public firstName: string,
      public lastName: string
    ) {}
  }
  let g = new Person('matt', 'smith')
  // let h = new Person('matt', 12) // error!

}

// 明確な割り当て
{
  let i: number
  // let j = i * 3 // error <- 割り当て前に使用されている

  let s
  // let t = s * 3 // error undefinedの可能性

  let a: {
    b: number
    c?: string  // 定義されてなくてもOK
    [key: number]: boolean
    // インデックスシグネチャ構文 [key: T] : U   ※keyという名前である必要はない
    // 型Tの全てのキーは型Uの値を持たなければいけない
  }

  a = {b: 1} // ok
  a = {b: 1, c: undefined} // ok
  a = {b: 1, c: 'd'} // ok
  a = {b: 1, 10: true} // ok 型numberの値がbooleanになっている
  a = {b: 1, 10: true, 20: false} // ok
  // a = {10: true} // error <- プロパティbが欠けている
  // a = {b: 1, 33: 'red'} // error <- 型numberの値がstringになっている

  let user: {
    readonly firstName: string
  } = {
    firstName: 'Tanaka'
  }

  user.firstName // string
  // user.firstName = 'Suzuki' // error <- readonlyは再割り当てできない

  // 空のオブジェクト型
  let danger: {}
  danger = {}
  danger = {x: 1}
  danger = []
  danger = 2
  // danger = null // error
  // danger = undefined // error
  // nullとundefinedを除いて割り当て可能になるため、使わないほうがよい

  let obj: Object // {}の使用とほぼ同じなので使わないほうがよい
  // プロトタイプの組み込みメソッドに対する扱いが異なる
  // https://mzl.la/2VSuDJz
}

// 型エイリアス
{
  type Age = number

  type Person = {
    name: string
    age: Age // 別名で定義
  }

  let age: Age = 55
  let driver: Person = {
    name: 'James',
    age: age
  }

  type Color = 'red'
  // type Color = 'blue' // error 同じ型は宣言できない

  let x = Math.random() < .5

  if(x) {
    type Color = 'blue' // 型エイリアスはブロックスコープ
    let b: Color = 'blue'
  } else {
    let c: Color = 'red'
  }
}

// 合併(|, Union)と交差(&, Intersection)
{

  type Cat = {name: string, purrs: boolean}
  type Dog = {name: string, barks: boolean, wags: boolean}
  type CatOrBogBoth = Cat | Dog
  type CatAndDog = Cat & Dog

  let a: CatOrBogBoth = {
    name: 'Donkers',
    purrs: true, // のどをならす
    wags: true
    // 両方の性質を持たせることができる(もたなくてもよい)
  }

  let b: CatAndDog = {
    name: 'Domino',
    barks: true,
    purrs: true,
    wags: true
    // 両方の性質を持たなければならない
  }

  type Return = string | null
  function ret(a: string, b: number) { // P35の構文に誤りあり(識別子なし)
    return a || b
  }
}


// 配列
{
  let a = [1, 2, 3] // number[]
  var arr_b = ['a', 'b'] // string[]
  let c: string[] = ['a'] // string[]
  let d = [1, 'a'] // (string | number)[]
  const e = [2, 'b'] // (string | number)[]

  let f = ['red']
  f.push('brue') // ok
  // f.push(true) // error <- stringに割り当て不可

  let g = []
  g.push(1)
  g.push('red') // (string | number)[]

  let h: number[] = []
  h.push(1)
  // h.push('red') // error <- numberに割り当て不可

  // 配列構文として、T[]とArray</T>があるが、意味・パフォーマンスともに同じ

  // 配列の定義は「均一」するほうがよい
}

// タプル(tuple)
// 配列のサブタイプ。固定長の配列を型付けできる
{
  let a: [number] = [1]
  let b: [string, string, number] = ['malcolm', 'gladwell', 1963]

  let trainFares: [number, number?][] // 省略可能の?
  let friends: [string, ...string[]] // 可変長サポート

  let as: readonly number[] = [1, 2, 3] // readonly number[]
  let bs: readonly number[] = as.concat(4) // readonly number[]
  let three = bs[2] // number
  // as[4] = 5 // error <- 読み取りのみの許可
  // as.push(6) // error <- pushメソッドは定義されない

  // 読み取り専用を宣言するための型エイリアス
  type A = readonly string[]
}


// null, undefined, void, never
{
  // (number | null)  null:値の欠如
  function a(x: number): (number | null) {
    if(x < 10) {
      return x
    }
    return null
  }

  // undefined: 値がまだ割り当てられていない
  function b(): undefined {
    return undefined
  }

  // void: returnを持たない関数戻り値
  function c(): void {
    let a = 2 + 2
    let b = a * a
  }

  // never: 消して戻らない関数戻り値(必ず例外、無限ループ)
  function d(): never {
    throw TypeError('I always error')
  }

  function e(): never {
    while(true) {
      // do something
    }
  }
}


// 列挙型
{
  enum Language {
    English,
    Spanish,
    Chinese,
    Japanese
  }

  Language.English // Language


  enum API {
    SELECT = '/api/search',
    CREATE = '/api/create',
    UPDATE = '/api/update',
    DELETE = '/api/delete'
  }

  let select = API.SELECT

  // const enumの利用
  const enum MONTH {
    JANUARY,
    FEBRUARY,
    MARCH
    // ...
  }
  function getMonth(m: MONTH) {
    return 'Get month!'
  }

  getMonth(MONTH.JANUARY)
  getMonth(MONTH.FEBRUARY)
  getMonth(100) // 問題なく動く!?
  // これを防ぐには文字列値のenumだけにしないといけない

  function getApi(api: API) {
    return 'Get API!'
  }

  getApi(API.SELECT) // ok
  // getApi(100) // error
  // getApi('/api/evilcall') // error
}
