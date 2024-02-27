import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const JOB_CARD = '.gb-results-list__item'

const JOB_TITLE = '.gb-results-list__title strong'
const JOB_COMPANY = '.gb-results-list__info div strong'
const JOB_LOCATION = '.gb-results-list__info .location'
const JOB_PAYMENT_RANGE = '.fa.fa-money.tooltipster-basic.green'
const JOB_PUBLISHED_DATE = '.opacity-half.size0'

const dateComparison = (date: string) => {
  const actualDate = new Date()
  const actualMonth = actualDate.getMonth()
  const actualDay = actualDate.getDate()

  const { 0: day, 1: month } = date.split(" ")
  const monthDate = day.toLowerCase()
  const dayDate = Number(month)

  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  const monthIndex = months.indexOf(monthDate)

  if ((actualMonth > monthIndex) || (actualMonth === monthIndex && actualDay >= dayDate)) {
    return actualDate.getFullYear()
  } else {
    return actualDate.getFullYear() - 1
  }

}

const scrape = async (job = 'programacion') => {
  const web = await fetch(`https://www.getonbrd.com/empleos/${job}?lang=es`)
  const html = await web.text()
  return cheerio.load(html)
}

// const getMoreJobInfo = async (jobs: any) => {
//   const jobsData: any = []

//   for (const job of jobs) {
//     const web = await fetch(job.url)
//     const html = await web.text()
//     const $ = cheerio.load(html)

//     $('.gb-landing-cover').each((i, el) => {
//       const time = $(el).find('time').text().trim()
//       const dateString = time.replaceAll(' de ', ' ')
//       const date = new Date(dateString)

//       const jobData = {
//         ...job,
//         published: time,
//         publish_timestamp: date.getTime()
//       }

//       jobsData.push(jobData)
//     })
//   }

//   return jobsData
// }

const getListOfJobs = async () => {
  const $ = await scrape()
  const jobs: any = []

  $(JOB_CARD).each((i, el) => {
    const title = $(el).find(JOB_TITLE).text()
    const company = $(el).find(JOB_COMPANY).text()
    const location = $(el).find(JOB_LOCATION).text().replaceAll('\n', '').trim()
    const payment = $(el).find(JOB_PAYMENT_RANGE).attr('title') || null
    const published = $(el).find(JOB_PUBLISHED_DATE).text().trim()
    const url = $(el).attr('href')

    const isHybrid = "El trabajo se desempeña algunos días de forma remota y otros en la oficina"
    const isPresential = "El trabajo debe ser desempeñado íntegramente de manera presencial"
    const year = dateComparison(published)

    const job = {
      title,
      company,
      location: location.split('en: ')[1]
        ? location.split('en: ')[1].replace('(', ' (')
        : location.split(' ')[0].replace('El', '').replace('(', ' ('),
      modality: location.includes(isPresential)
        ? 'Presencial'
        : location.includes(isHybrid)
          ? 'Híbrido'
          : location,
      payment,
      published,
      year,
      url
    }

    jobs.push(job)
  })

  console.info(jobs.length + ' jobs generated')

  return jobs
}

const writeDBFile = async (data: any) => {
  const filePath = path.join(process.cwd(), './db/gob-jobs.json')
  return await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

(async () => {
  const jobsData = await getListOfJobs()
  writeDBFile(jobsData)
})()
