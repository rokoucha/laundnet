import { JSDOM } from 'jsdom'
import { ShopDetail, $numericString } from './type'
import $ from 'transform-ts'
import fetch from 'node-fetch'
import jar from './jar'

const HEADERS = {
  'Accept-Language': 'ja',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 6.3; Win64; rv:74.0) Gecko/20100101 Firefox/74.0 laundnet/1.0',
  Accept: 'text/html',
  DNT: '1',
  Referer: 'https://www.coin-laundry.co.jp/userp/shop_detail/11000921',
}

class PathResolver {
  baseUrl: URL

  constructor(url: string) {
    this.baseUrl = new URL(url)
  }

  resolve(path: string): string {
    return new URL(path, this.baseUrl).href
  }
}

const CONFIG = $.obj({
  LAUNDNET_EMAIL: $.string,
  LAUNDNET_PASSWORD: $.string,
  LAUNDNET_SHOPID: $numericString,
}).transformOrThrow(process.env)

const main = async () => {
  const path = new PathResolver('https://www.coin-laundry.co.jp')

  const mainPagePath = `/userp/shop_detail/${CONFIG.LAUNDNET_SHOPID}`

  const loginPage = await fetch(
    path.resolve(`/userp/member/login?redirect=${mainPagePath}`),
    {
      headers: HEADERS,
    },
  )
  jar.setCookies(
    loginPage.headers.raw()['set-cookie'],
    path.resolve(`/userp/member/login?redirect=${mainPagePath}`),
  )

  const dom = new JSDOM(await loginPage.text())
  const token = dom.window.document.querySelector<HTMLInputElement>(
    '#form1 > input[name=token]',
  )!

  const params = new URLSearchParams()
  params.append('mailAddress', CONFIG.LAUNDNET_EMAIL)
  params.append('password', CONFIG.LAUNDNET_PASSWORD)
  params.append('redirect', mainPagePath)
  params.append('token', token.value)

  const body = params.toString()

  const login = await fetch(path.resolve('/userp/member/login.html?stage=2'), {
    body,
    headers: {
      ...HEADERS,
      'Content-Length': body.length.toString(),
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: await jar.getCookieString(
        path.resolve('/userp/member/login.html?stage=2'),
      ),
      Referer: path.resolve(`/userp/member/login?redirect=${mainPagePath}`),
    },
    method: 'POST',
  })
  jar.setCookies(
    login.headers.raw()['set-cookie'],
    path.resolve('/userp/member/login.html?stage=2'),
  )

  const detail = await fetch(
    path.resolve(
      `/userp/view_interface.php?shopId=${CONFIG.LAUNDNET_SHOPID}&className=AilsShopDetail`,
    ),
    {
      headers: {
        ...HEADERS,
        Cookie: await jar.getCookieString(
          path.resolve(
            `/userp/view_interface.php?shopId=${CONFIG.LAUNDNET_SHOPID}&className=AilsShopDetail`,
          ),
        ),
      },
    },
  )
  const detailObject = ShopDetail.transformOrThrow(await detail.json())

  console.log(detailObject.LOGIN_STATE)
  console.log(detailObject.CARDPOINT[0].NUMPOINT)
}

main().catch(e => {
  throw e
})
