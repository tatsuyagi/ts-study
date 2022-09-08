/**
 * 8章 非同期プログラミングと並行・並列処理
 */

// JavaScriptのイベントループ
{

  setTimeout(() => console.log('A'), 1000)
  setTimeout(() => console.log('B'), 2000)
  console.log('C');

  /**
   * メインスレッドからネイティブな非同期API(XML HTTP Request, setTimeout, readFile, etc...)を呼び出すと
   * すぐに制御はメインスレッドに戻る
   * ・非同期処理が完了するとイベントキューにタスクを格納(コールバック関数などの情報をもつ)
   * ・メインスレッドのコールスタックが空になると、イベントキューに存在するタスクを実行する
   * ・コールスタックとイベントキューが両方からになるまで繰り返す
   */

  // 非同期JavaScriptの基本単位はコールバック(callback)
  // readFileの型シグネチャ
  function readFile(
    path: string,
    options: {encoding: string, flag?: string},
    callback: (err: Error | null, data: string | null) => void
  ): void

  // 関数が同期的かどうかを型によって示すことができない
  // 直接に並べるのも難しい（コールバック地獄）
  // async1((err1, res1) => {
  //   if(res1) {
  //     async2((err2, res2) => {
  //       if(res2) {
  //         async3((err3, res3) => {
  //           ...
  //         })
  //       }
  //     })
  //   }
  // })


  // では、どうするか　⇒　Promiseを使う！
  function appendAndReadPromise(path: string, data: any): Promise<string> {
    return appendPromise(path, data)
      .then(() => readPromise(path, data))
      .then(() => doSomething(data))
      .catch(err => console.error(err))
  }

  // type Executor = (
  //   resolve: Function,
  //   reject: Function
  // ) => void

  // type Executor<T, E extends Error> = (
  //   resolve: (result: T) => void,
  //   reject: (error: E) => void
  // ) => void

  // class Promise<T, E extends Error> {
  //   constructor(f: Executor<T, E>) {}
  //   then<U, F extends Error>(g: (result: T) => Promise<U, F> | U): Promise<U, F>
  //   catch<U, F extends Error>(g: (result: E) => Promise<U, F> | U): Promise<U, F>
  // }

  type Executor<T> = (
    resolve: (result: T) => void,
    reject: (error: unknown) => void
  ) => void

  class Promise<T> {
    constructor(f: Executor<T>) {}
    then<U>(g: (result: T) => Promise<U> | U): Promise<U>
    catch<U>(g: (result: unknown) => Promise<U> | U): Promise<U>
  }

  // Promiseの実装は難しい！
  // http://bit.ly/2JT3KUh


  // プロミスは非同期を扱う強力な抽象化機能
  // なので、独自構文まで用意されている
  // -> async await

  // Promiseの場合
  function getUser() {
    getUserID(18)
      .then(user => getLocation(user))
      .then(location => console.log('got location', location))
      .catch(error => console.error(error))
      .finally(() => console.info('done getting location'))
  }

  // async/awaitの場合
  async function getUser() {
    try {
      let user = await getUserID(18)
      let location = await getLocation(user)
      console.info('got location', location)
    } catch (error) {
      console.error(error)
    } finally {
      console.info('done getting location')
    }
  }

}

// 非同期ストリーム
{
  /**
   * プロミスは未取得の値に対する操作のモデリング、直列化、組み立てに優れている
   * 
   * ⇒複数の値があり、将来複数の時点で利用可能になる場合はどうか
   * 　・動画配信サーバからのストリーミングデータ
   * 　・フォーム入力のキーストローク
   * それぞれのものが将来のどこかの時点でやってくる物事のリスト
   * 
   * これをモデル化するのは、イベントエミッター(Node.jsのEventEmitterなど)やRxJSのような
   * リアクティブプログラミングライブラリを使うことで実現できる
   * 
   * 違いはコールバックとプロミスの関係に似ている
   * 　⇒イベントエミッターは軽量で迅速
   * 　⇒リアクティブプログラミングライブラリは強力でイベントのストリームを組み立てたり
   * 　　直列に並べたりできる
   */ 

  /** 
   * 【リアクティブプログラミング】
   * データストリームとその変更の伝搬と関心事とする宣言的プログラミングパラダイム
   */
  // 命令型プログラミング
  let a = 3
  let b = 5
  let c = a + b // c = 8
  a = 5 // c = 8 ※値は変化しない

  // リアクティブプログラミング
  let s = 3
  let t = 5
  let u = s + t // u = 8
  a = 5 // u = 10 ※値が再計算される

  // 【参考】プログラミングパラダイム(思想)
  // 非構造化プログラミング
  // 構造化/手続き型/命令型プログラミング
  // オブジェクト指向プログラミング
  // アスペクト指向プログラミング
  // 関数型プログラミング

  // イベントエミッター(event emitter)
  // ⇒チャネル上でのイベントの発行(emit)とチャネル上のイベントに
  //   対するリッスン(listen)をサポートするAPIを提供
  interface Emitter {
    // イベントの送信
    emit(channel: string, value: unknown): void
    // イベントが送信されたら何かを行う
    on(channel: string, f: (value: unknown) => void): void
  }

  // 多くの言語はvalueの型が特定のchannelに依存し、型で関係を表せない
  // TypeScriptは型システムで安全に表現できる
  
  // RedisClientを例に
  type Events = {
    ready: void
    error: Error
    reconnecting: {attempt: number, delay: number}
  }

  type RedisClient = {
    on<E extends keyof Events>(
      event: E,
      f: (arg: Events[E]) => void
    ):void

    emit<E extends keyof Events>(
      event: E,
      arg: Events[E]
    ): void
  }

  // WindowEventMapのaddEventListener

}

import {fork} from 'child_process'

{
  let child = fork('
  ')
}