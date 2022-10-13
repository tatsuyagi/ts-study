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
import { resolve } from 'path';
import { listenerCount } from 'process';


// モジュールモードとスクリプトモード

// モジュールモード
// import とか import() を使って他のファイルからコードを要求し、exportを使って
// 他のファイルでもコードを利用できるようにする

// スクリプトモード
// プログラマが宣言するトップレベルの変数は、明示的なインポートがなくても、
// プロジェクト内の他のファイルから利用可能



/**
 * 名前空間
 * 
 * コードをカプセル化するための方法の一つ
 * 名前空間はファイルシステム内でファイルがどのように配置されるかという詳細を抽象化する
 * 
 * .mine関数がschemes/scams/bitcoin/appsフォルダの中に存在することを知る必要なく
 * Schemes.Scams.Bitcoin.Apps.mine のような名前空間を使って関数にアクセスする
 */


// Get.ts
namespace Network {
	export function get<T>(url: string):Promise<T> {
		// ～
		return new Promise((resolve, reject) => {

		});
	}
}

// App.ts
namespace App {
	Network.get<GitRepo>('https://api.github.com/repos/Microsoft/typescript')
}


// 名前空間はNetworkのように名前を持つ必要がある
// 関数、変数、型、インターフェース、別の名前空間をエクスポートすることができる

// モジュールが大きくなってきたら、サブモジュールに分割することができる

namespace Network {
	export namespace HTTP {
		export function get<T>(url: string):Promise<T> {
			// ～
			return new Promise((resolve, reject) => {
			});
		}	
	}

	export namespace TCP {
		export function listenOn(port: number): Connection {
			// ・・・
		}
	}

	export namespace UDP {
		// ・・・
	}
}

// 別々に宣言しても、よろしくマージしてくれる
namespace Network {
	export namespace IP {
		// ・・・
	}
}


// 階層が長くなってきたら、名前空間エイリアスで短縮して使うことができる

// MyApp.ts
import httpGet = Network.HTTP.get // エイリアスを定義

let repo: Promise<GitRepo> = httpGet<GitRepo>('https://api.github.com/repos/Microsoft/typescript');



// 同じ名前のエクスポートの競合は許されない
namespace Network {
	export function request<T>(url: string): T {
		// ・・・
	}
}

namespace Network {
	export function request<T>(url: string) { // ←おこられる
		// ・・・
	}
}


// コンパイルされたときの出力

// Flowers.ts
// namespace Flowers {
// 	export function give(count: number) {
// 		return count + ' flowers'
// 	}
// }

// 上記ファイルをTSCでコンパイルすると

(function (Flowers) {
	function give(count) {
		return count + ' flowers'
	}

	Flowers.give = give
})(Flowers || (Flowers = {}))


// と、ここまで書いてきたが 可能であれば名前空間よりモジュールを使ったほうがいいらしい
// 明示的な依存関係には、読みやすさ、モジュールの分離の強制、および静的解析に関して
// 多くのメリットがある

// 大きなフロントエンドプロジェクトでは特に重要になる



/**
 * 宣言のマージ
 * 
 * これまでTypeScriptが行う3種類のマージについて触れてきている
 * ① 値の型のマージ（コンパニオンオブジェクトパターン）
 * ② 同じ名前を持つ複数の名前空間のマージ
 * ③ 同じ名前を持つ複数のインターフェースのマージ
 */

