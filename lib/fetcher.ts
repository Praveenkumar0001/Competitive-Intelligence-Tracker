import axios from 'axios'
import * as cheerio from 'cheerio'

export async function fetchWebContent(url: string): Promise<{ html: string; text: string }> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 15000,
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Remove script and style elements
    $('script').remove()
    $('style').remove()
    $('noscript').remove()

    const text = $('body').text().replace(/\s+/g, ' ').trim()

    return { html, text }
  } catch (error: any) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}
