/**
 * 7章 エラー処理
 */
// TypeScriptでエラーを表現したり処理したりするための、よく使われるパターンを紹介する章

// 7.1 nullを返す
{
  function ask() {
    return prompt('when is your birthday?') || ''
  }

  function parse(birthday: string): Date | null {
    let date = new Date(birthday)
    if(!isValid(date)) {
      return null
    }
    return date
  }

  // 日付が有効かチェックする
  function isValid(date: Date): boolean {
    return Object.prototype.toString.call(date) === '[object Date]'
      && !Number.isNaN(date.getTime())
  }

  let date = parse(ask())
  if(date) {
    console.info(`Date is ${date.toISOString()}`)
  } else {
    console.info('Error parsing date for some reason')
  }

}


// 7.2 例外をスローする
{
  function ask() {
    return prompt('when is your birthday?') || ''
  }
  
  /**
   * @throws {RangeError} エラー
   */
  function parse(birthday: string): Date{
    let date = new Date(birthday)
    if(!isValid(date)) {
      throw new RangeError('Enter a date in the form YYYY/MM/DD')
    }
    return date
  }
  // 日付が有効かチェックする
  function isValid(date: Date): boolean {
    return Object.prototype.toString.call(date) === '[object Date]'
      && !Number.isNaN(date.getTime())
  }
  class MyError extends RangeError {}

  try {
    let date = parse(ask())
    console.info(`Date is ${date.toISOString()}`)
  } catch (e) {
    if (e instanceof RangeError) {
      console.error(e.message)
    } else {
      throw e
    }
  }

  // RangeError以外を握りつぶさないように再スローも必要
}

// 7.3 例外を返す
{
  class InvalidDateFormatError extends Error {}
  class DateIsInTheFutureError extends Error {}

  function parse(
    birthday: string
  ): Date | InvalidDateFormatError | DateIsInTheFutureError {

    let date = new Date(birthday)

    if(!isValid(date)) {
      return new InvalidDateFormatError('Enter a date in the form YYYY/MM/DD')
    }

    if(date.getTime() > Date.now()) {
      return new DateIsInTheFutureError('Are you a timelord?')
    }

    return date
  }

  // 日付が有効かチェックする
  function isValid(date: Date): boolean {
    return Object.prototype.toString.call(date) === '[object Date]'
      && !Number.isNaN(date.getTime())
  }

  let date = parse(ask())
}


// 7.4 Option型
{
  function parse(birthday: string): Date[] {
    let date = new Date(birthday)

    if (!isValid(date)) {
      return []
    }

    return [date]
  }

  function isValid(date: Date): boolean {
    return Object.prototype.toString.call(date) === '[object Date]'
      && !Number.isNaN(date.getTime())
  }

  function ask() {
    return prompt('when is your birthday?') || ''
  }

  let date = parse(ask())

  date.map(_ => _.toISOString())
      .forEach(_ => console.info('Date is', _))

}