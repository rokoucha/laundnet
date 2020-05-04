import $, { Transformer, ValidationError, error, ok } from 'transform-ts'

export class DoesNotNumericStringError extends Error {
  constructor(readonly text: string) {
    super(`string "${text}" does not numeric string.`)
    this.name = 'DoesNotNumericStringError'
  }
}

export const $numericString = Transformer.from<string, string>(text =>
  Number.isNaN(Number(text))
    ? error(ValidationError.from(new DoesNotNumericStringError(text)))
    : ok(text),
)

export class InvalidDateText extends Error {
  constructor(readonly time: number) {
    super(`"${time}" is invalid unixtime.`)
    this.name = 'InvalidUnixtimeError'
  }
}

export const $dateText = Transformer.from<number, Date>(text => {
  const date = new Date(text)
  return isNaN(date.getTime())
    ? error(ValidationError.from(new InvalidDateText(text)))
    : ok(date)
})

export class DoesNotMatchPatternError extends Error {
  constructor(readonly pattern: RegExp, readonly text: string) {
    super(
      `string "${text}" does not match the pattern "${pattern.toString()}".`,
    )
    this.name = 'DoesNotMatchPatternError'
  }
}

export function $regexp(regexp: RegExp) {
  return Transformer.from<string, string>(text =>
    regexp.test(text)
      ? ok(text)
      : error(ValidationError.from(new DoesNotMatchPatternError(regexp, text))),
  )
}

export const ShopDetail = $.obj({
  CARDPOINT: $.array(
    $.obj({
      ANKGROUPID: $numericString,
      ANKCARDID: $numericString,
      NUMPOINT: $.number,
      ANKREGISTFLG: $numericString,
      ANKFPOINTFLG: $numericString,
      ANKMAILADDRESS: $.nullable($.string),
      ANKSHOPID: $numericString,
    }),
  ),
  ICONDESCRIPTION: $.array(
    $.obj({
      NUMID: $.number,
      KNJNAME: $.string,
      KNJCOMMENT: $.string,
      NUMSORT: $.number,
    }),
  ),
  CAMPAIGN: $.array($.any),
  SHOP: $.obj({
    MIXTITLE: $.string,
    MIXNOTICE: $.string,
    ANKSHOPTYPE: $numericString,
    ANKFAXNUM: $.nullable($.any),
    MIXHPLINK: $.string,
    TIMOPENFROM: $.nullable($.any),
    TIMOPENTO: $.nullable($.any),
    DTMOPENDATE: $dateText,
    DTMSHOPOPENDATE: $dateText,
    NUMSORT: $.number,
    ANKAILSFLG: $numericString,
    BINSHOPOUTER: $numericString,
    BINSHOPINNER: $numericString,
    BINSHOPMAP: $.nullable($.any),
    BINMAPGIF: $.nullable($.any),
    BINMAPJPG: $.nullable($.any),
    BINKSHOPINNERGIF: $.nullable($.any),
    BINKSHOPINNERJPG: $numericString,
    MIXHOLIDAY: $.string,
    MIXBUSINESSHOUR: $.string,
    NUMFACILITYLIST: $regexp(/(\d+,?)+/g),
    ANKSHOPID: $numericString,
    ANKLONGITUDE: $regexp(/\d+\.\d+ /),
    ANKPARALLEL: $regexp(/\d+\.\d+ /),
    KNJSHOPNAME: $.string,
    KANASHOPNAME: $.string,
    ANKPOSTNUM: $.string,
    KNJADDRESS1: $.string,
    KNJADDRESS2: $.string,
    KNJADDRESS3: $.string,
    ANKTELNUM: $.string,
    ANKWEBSHOPFLG: $numericString,
    ENABLESHOWIMAGE: $.nullable($.any),
  }),
  OPERATIONALSTATUS: $.array(
    $.obj({
      ANKSHOPID: $numericString,
      ANKMACHINENUM: $numericString,
      MIXPARTNUM: $.string,
      KNJMACHNAME: $.string,
      ANKCOMFLG: $numericString,
      ANKAILSFLG: $numericString,
      ANKKHKIND: $numericString,
      ANKDRUMFLG: $numericString,
      ANKPOL: $.string,
      ANKK_GU: $.string,
      ANKK_GT: $.string,
      ANKK_GK: $.string,
      ANKSTS: $.string,
      NUMDOORLOCK: $.number,
      NUMCOINLOCK: $.number,
      DTMCREATE: $dateText,
    }),
  ),
  LOGIN_STATE: $.boolean,
})
