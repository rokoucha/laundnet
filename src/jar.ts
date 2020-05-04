import { CookieJar } from 'tough-cookie'

class CookiesJar extends CookieJar {
  async setCookies(cookies: string[], url: string) {
    await Promise.all(
      cookies.map(async cookie => await this.setCookie(cookie, url)),
    )
  }
}

export default new CookiesJar()
