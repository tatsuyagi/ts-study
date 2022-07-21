/**
 * 5章 クラスとインターフェース
 * 
 * TypeScriptのクラスはC#から多くを借用している
 * アクセス修飾子、プロパティ初期化子、ポリモーフィズム、デコレーター、インターフェース
 */

// 5.1 クラスと継承
{
  // チェスのゲームを表す
  class Game {
    private pieces = Game.makePieces()

    private static makePieces() {
      return [
        new King('White', 'E', 1),
        new King('Black', 'E', 8)
        // 以下初期配置でクラスを初期化
      ]
    }
  }

  // チェスの駒
  abstract class Piece {
    protected position: Position
    constructor(
      private readonly color: Color,
      file: File,
      rank: Rank
    ) {
      this.position = new Position(file, rank)
    }

    moveTo(position: Position) {
      this.position = position
    }
    /**
     * 指定ポジションに移動可能か判定する
     * @param position 移動先
     */
    abstract canMoveTo(position: Position): boolean
  }

  // 駒の位置
  class Position {
    constructor(
      private file: File,
      private rank: Rank
    ) {}

    distanceFrom(position: Position) {
      return {
        rank: Math.abs(position.rank - this.rank),
        file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0))
      }
    }
  }

  // 6種類の駒
  class King extends Piece {
    canMoveTo(position: Position): boolean {
      let disance = this.position.distanceFrom(position)
      return disance.rank < 2 && disance.file < 2
    }
  }
  class Queen extends Piece {}
  class Bishop extends Piece {}
  class Knight extends Piece {}
  class Rook extends Piece {}
  class Pawn extends Piece {}

  // Pieceに色と位置を追加(数が少ないので、リテラル型で列挙する)
  type Color = 'Black' | 'White'
  type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' // X軸
  type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 // Y軸


  // アクセス修飾子
  // public: どこからでもアクセス可能
  // protected: このクラスとサブクラスのインスタンスからアクセス可能
  // private: このクラスのインスタンスからのみアクセス可能

  // abstract 抽象クラス
  // インスタンス化できない
  // new Piece('White', 'E', 1) -> エラー
  
  // メソッドは定義できる

}

// 5.3 戻り値としてのthisの利用
{
  class Set {
    has(value: number): boolean {
      return false
    }
    add(value: number): Set {
      return this
    }
  }

  class MutableSet extends Set {
    delete(value: number): boolean {
      return false
    }
  }

}

// 5.4 インターフェース
{

  // 型エイリアスと似ている
  // type Sushi = {
  //   calolies: number
  //   salty: boolean
  //   tasty: boolean
  // }
  type Food = {
    calolies: number
    tasty: boolean
  }
  type Cake = Food & {
    sweet: boolean
  }

  interface Sushi {
    calolies: number
    salty: boolean
    tasty: boolean
  }

  interface Tempura {

  }
}