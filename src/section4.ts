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
  // // 名前付き関数
  // function add(a:number, b:number):number {
  //   return a + b
  // }

  // // 関数式
  // let greet2 = function(name: string) {
  //   return 'hello ' + name
  // }

  // // アロー関数式
  // let greet3 = (name: string) => {
  //   return 'hello ' + name
  // }

  // // アロー関数の略記法
  // let greet4 = (name: string) => 'hello ' + name

  // // 関数コンストラクタ(安全でないので使用すべきではない)
  // // パラメータや戻り値が型付けされないため
  // let greet5 = new Function('name', 'return "hello " + name')

  // // add(1) // error 引数の数
  // // add(1, '2') // error 引数の型


  // // オプションパラメータ(?)
  // function log1(message: string, userId?: string) {
  //   let time = new Date().toLocaleTimeString()
  //   console.log(time, message, userId || 'Not signed in')
  // }

  // // デフォルトパラメータ
  // function log2(message: string, userId = 'Not signed in') {
  //   let time = new Date().toISOString()
  //   console.log(time, message, userId)
  // }

  // // レストパラメータ
  // function sum(numbers: number[]): number {
  //   return numbers.reduce((total, n) => total + n, 0)
  // }

  // function sumVariadic(): number {
  //   return Array
  //     .from(arguments)// 使うべきでない
  //     .reduce((total, n) => total + n, 0) // totalやnがany型になってしまう
  // }

  // function sumVariadicSafe(...numbers: number[]): number {
  //   return numbers.reduce((total, n) => total + n, 0)
  // }

  // // call, apply, bind (第一引数はthisのバインド)
  // add(10, 20)               // 30
  // add.apply(null, [10, 20]) // 30
  // add.call(null, 10, 20)    // 30
  // add.bind(null, 10, 20)()  // 30

  // // bindだけでは実行されない
  // add.bind(null, 10, 20).call(null)
  // add.bind(null, 10, 20).apply(null)

  // // thisの型付け
  // // thisはメソッド呼び出し時にドット(.)の左側の値をとるのが一般的ルール
  // let x = {
  //   a() {
  //     return this
  //   }
  // }

  // x.a() // aの本体内でthisはオブジェクトx
  // let a = x.a
  // a() // 本体内でthisはundefined???

  // // ジェネレータ
  // function* createFibonacciGenerator() {
  //   let a = 0
  //   let b = 1
  //   while(true) {
  //     yield a; // generatorが返す値
  //     [a, b] = [b, a + b]
  //   }
  // }

  // let generator = createFibonacciGenerator()
  // generator.next() // {value: 0, done: false}

  // // イテレータ
  // let numbers = {
  //   // Symbol.iterator というプロパティを持つと、反復可能オブジェクトになる
  //   *[Symbol.iterator]() {
  //     for(let n = 1; n <= 10; n++) {
  //       yield n
  //     }
  //   }
  // }

  // // 呼び出しシグネチャ, 型シグネチャ
  // // addは(a: number, b: number) => number
  // type addType = (a: number, b: number) => number
  // type sumType = {
  //   (numbers: number[]): number
  // }

  // let sumFunc: sumType = (numbers: number[]) => {
  //   return 1;
  // }

  // function aaa(s: string): string {
  //   return "";
  // }


  // // // 関数のオーバーロード
  // type CreateElement = {
  //   (tag: 'a'): HTMLAnchorElement
  //   (tag: 'canvas'): HTMLCanvasElement
  //   (tag: 'table'): HTMLTableElement
  //   (tag: string): HTMLElement
  // }

  // let genElm: CreateElement = (tag: string) {
  //   return `<${tag}></${tag}>`
  // }

  // genElm('foo') // <foo></foo> => HTMLElement
  // genElm('canvas') // <foo></foo> => HTMLCanvasElement

  // function warnUser(warning: string):void {
  //   if (warnUser.wasCalled) {
  //     return;
  //   }
  //   warnUser.wasCalled = true;
  //   alert(warning)
  // }

  // type WarnUser = {
  //   (warning: string): void
  //   wasCalled: boolean
  // }

  // let warn: WarnUser = (warning: string) {
  //   if (warnUser.wasCalled) {
  //     return;
  //   }
  //   warnUser.wasCalled = true;
  //   alert(warning)

  // }


  // // ポリモーフィズム、ジェネリック型

  // 配列もらって条件にあうデータを除外した配列を返す
  type MyFilter = <T>(array: T[], f: (item: T) => boolean) => T[]

  let numberFilter: MyFilter = (array, f) => {
    let result = [];
    for (let item of array) {
      if ( !f(item) ) {
        result.push(item);
      }
    }
    return result;
  }

  numberFilter(["1", "2", "3"], (val) => val !== "2");


  // 使えるときはできるだけジェネリックを使うようにする

  // 4.2.1 ジェネリックはいつバインドされる？
  // => ジェネリックを使用するときに具体的な型をバインドする
  

  // mapをジェネリックで記述する
  function map<T, U>(array: T[], f: (item: T) => U): U[] {
    let result = []
    for (let i = 0 ; i < array.length; i++) {
      result[i] = f(array[i])
    }
    return result;
  }

  /**
   * a -> b
   * a -> c
   * b -> d
   * 
   */
  type TreeNode = {
    isRoot: boolean
  }

  type RootNode = TreeNode & {
    // true
  }
  type LeafNode = TreeNode & {
    // false
  }

  type InnerNode = TreeNode & {
    // false
  }

  function treeNodeConverter<T, U extends TreeNode>(array: T[], f: (item: T) => U): U[] {
    let result = []
    for (let i = 0 ; i < array.length; i++) {
      result[i] = f(array[i])
    }
    return result;
  }

  treeNodeConverter([1, 2, 3], (n) => {
    let a : LeafNode = {
      isRoot: false
    };
    return a;
  })

  // http.request().then((ret) => {
  //   ret.json()
  // })

  // async function aaa() {
  //   let ret = await http.request(); // 200ms
  //   ret.json()
  // }

}

{
  /**
   * TypeScriptが型シグネチャで推論するのはどこ
   * パラメータ、戻り値型、その両方
   */

  /**
   * JavaScriptのargumentsは型安全か
   */

  /**
   * 型安全なアサーション関数(is)を実装してください
   * 
   * is('string', 'other') -> false
   * 
   * is(true, false) -> false
   * 
   * is(42, 42) -> true
   * 
   * // 任意の引数を渡せる（難問）
   * is(1, 1, 1) -> true
   * is(1, 2, 1) -> false
   */



}