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

let test: number = 1

let func2 = function(callback: (response: string) => void) {
  // API呼び出し
  // $.ajax.post('http://localhost:8080/api/v1/test')
  //   .done(callback)
  //   // .done(function(response){
  //   //   console.log(response.json());
  //   // })
  //   .catch()
  
  return function() {

  }
}

let func3 = function(response: string) {
  console.log(response);
}

func2(func3)() // 入口

func2(function(response) {
  // hogehoge
}) // 入口

// func2が呼ばれる
// API呼び出し
// func3が呼ばれる(done)


// 関数の宣言と呼び出し
{
  // // 名前付き関数
  // function add(a:number, b:number):number {
  //   return a + b
  // }

  // 関数式
  let greet2 = function(name: string):string {
    return 'hello ' + name
  }

  // アロー関数式
  let greet3 = (name: string):string => {
    return 'hello ' + name
  }

  // アロー関数の略記法
  let greet4 = (name: string):string => 'hello ' + name

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
  // レストパラメータ
  function sum(numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0)
  }

  sum([1, 2, 3])

  function sumVariadic(): number {
    return Array
      .from(arguments)// 使うべきでない
      .reduce((total, n) => total + n, 0) // totalやnがany型になってしまう
  }

  type RootNode = TreeNode & {
    // true
  }
  type LeafNode = TreeNode & {
    // false
  }
  // sumVariadic(1, 2)
  // sumVariadic(1, 2, 3, 4, 5)


  // type InnerNode = TreeNode & {
    // false
  // call, apply, bind (第一引数はthisのバインド)
  // add(10, 20)               // 30
  // add.apply(null, [10, 20]) // 30
  // add.call(null, 10, 20)    // 30
  // let func3 = add.bind(null, 10, 20)  // 30
  // let func4 = add.bind(null, 110, 120)  // 30

  // bindだけでは実行されない
  // func3();
  // add.bind(null, 10, 20).call(null)
  // add.bind(null, 10, 20).apply(null)

  // thisの型付け
  // thisはメソッド呼び出し時にドット(.)の左側の値をとるのが一般的ルール
  let x = {
    a() {
      return this
    }
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