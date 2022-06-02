/**
 * 4章 関数について
 *
 * TypeScriptでの関数の宣言方法と呼び出し方法
 * シグネチャのオーバーロード
 * 関数についてのポリモーフィズム
 * 型エイリアスについてのポリモーフィズム
 *
 * 関数は第一級オブジェクト（他のオブジェクトと同じように扱うことが可能）
 */

// 関数の宣言と呼び出し
{
  // 名前付き関数
  function add(a:number, b:number):number {
    return a + b
  }

  // 関数式
  let greet2 = function(name: string) {
    return 'hello ' + name
  }

  // アロー関数式
  let greet3 = (name: string) => {
    return 'hello ' + name
  }

  // アロー関数の略記法
  let greet4 = (name: string) => 'hello ' + name

  // 関数コンストラクタ(安全でないので使用すべきではない)
  // パラメータや戻り値が型付けされないため
  let greet5 = new Function('name', 'return "hello " + name')

  // add(1) // error 引数の数
  // add(1, '2') // error 引数の型


  // オプションパラメータ(?)
  function log1(message: string, userId?: string) {
    let time = new Date().toLocaleTimeString()
    console.log(time, message, userId || 'Not signed in')
  }

  // デフォルトパラメータ
  function log2(message: string, userId = 'Not signed in') {
    let time = new Date().toISOString()
    console.log(time, message, userId)
  }

  // レストパラメータ
  function sum(numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0)
  }

  function sumVariadic(): number {
    return Array
      .from(arguments)// 使うべきでない
      .reduce((total, n) => total + n, 0) // totalやnがany型になってしまう
  }

  function sumVariadicSafe(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0)
  }

  // call, apply, bind (第一引数はthisのバインド)
  add(10, 20)               // 30
  add.apply(null, [10, 20]) // 30
  add.call(null, 10, 20)    // 30
  add.bind(null, 10, 20)()  // 30

  // bindだけでは実行されない
  add.bind(null, 10, 20).call(null)
  add.bind(null, 10, 20).apply(null)

  // thisの型付け
  // thisはメソッド呼び出し時にドット(.)の左側の値をとるのが一般的ルール
  let x = {
    a() {
      return this
    }
  }

  x.a() // aの本体内でthisはオブジェクトx
  let a = x.a
  a() // 本体内でthisはundefined???

  // ジェネレータ
  function* createFibonacciGenerator() {
    let a = 0
    let b = 1
    while(true) {
      yield a; // generatorが返す値
      [a, b] = [b, a + b]
    }
  }

  let generator = createFibonacciGenerator()
  generator.next() // {value: 0, done: false}

  // イテレータ
  let numbers = {
    *[Symbol.iterator]() {
      for(let n = 1; n <= 10; n++) {
        yield n
      }
    }
  }

  // 呼び出しシグネチャ, 型シグネチャ
  // addは(a: number, b: number) => number
  type addType = (a: number, b: number) => number
  
}