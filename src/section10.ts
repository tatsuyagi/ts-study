/**
 * 10章 名前空間とモジュール
 * 
 * コードの名前空間を指定し、それらをモジュール化するためのさまざまな方法
 * コードをインポートしたりエクスポートしたりするためのさまざまな方法
 * コードベースの増大に合わせて、これらのアプローチを拡大する方法
 * モジュールモードとスクリプトモード
 * 宣言のマージとは何か、それを使うと何ができるか
 */

// モジュールの歴史

<script src="/hoge.js"></script>
// hoge.js
aaa = 1;
fucntion funcHoge() {

}
<script src="/huga.js"></script>
// huga.js
aaa = 100;
funcHoge() //呼べる

// 最初はモジュールシステムがなかったので、全てがグローバル変数で宣言されてた
// 変数名の競合が発生しやすい状況
// 公開されたAPIとプライベートなAPIの区別もつけられない


// オブジェクトや即時実行関数式(IIFE: Immediately Invoked Function Expression)でモジュールをシミュレートしていた

window.myModule = {
  func1() {
    // 処理
  },
  aaa: 1,
  bbb: 2
}

window.myModule.func1()

window.myModule = window.myModule || function () {
  // 実装
}

$('.class')
underscore.js

let module1 = (function() {

  func1 = function() {

  }
  aaa = 1
  bbb = 2

  return {
    func1: func1,
    aaa: aaa
  }
})();

module1.func1()
module1.aaa // 1

module1.bbb // undefined


// その後、LABjsやCommonJSによるモジュール読み込みの仕組みが登場

// emailBaseModule.js
var emailList = require('emailListModule')

module.exports.renderBase = function() {
  // ・・・
}

// Webのほうでは、AMDというモジュール標準が公開(2008)
define('emailBaseModule',
  ['require', 'exports', 'emailListModule'],
  function(require, exports, emailListModule) {
    exports.renderBase = function() {
      // ・・・
    }
  }
)

// Browserifyが登場(2011)して、フロントエンドでもCommonJSを使えるように

// しかし、CommonJSにはいろいろ問題が。
// ・require呼び出しが同期的である点
// ・静的解析でない場合がある


// そして、ES2015(ECMAScriptの第6エディション)で新しい標準が導入された
import emailList from 'emailListModule'

export function renderBase() {
  // ・・・
}


// インポートとエクスポート

// a.ts

export function foo() {
}
export function bar() {
}

// b.ts
import {foo as f, bar} as aModule from './a'

f()


// c.ts
export default function meow1(loudness: number) {
  
}

export default function meow2(loudness: string) {
  
}


// d.ts
import { default as m } from './c'

m(11)


// g.ts
export let X = 3
export type X = {y: string}

// h.ts
import {X} from './g'

let a = X + 1
let b: X = {y: 'z'}


Moment.js

// 動的import
let locale = import('locale_us-en')

async function main() {
  let userLocale = await getUserLocale()
  let path = `./locales/locale-${userLocale}`
  let localeUS: typeof locale = await import(path)
}


namespace A {
  export namespace B1 {
  }
  
  export namespace B2 {

  }
}

import d = A.B1

