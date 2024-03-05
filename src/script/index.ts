import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Job } from '@/types'

export const MAIN_LIST_SELECTORS = {
  MAIN_JOB_CARD: '.gb-results-list__item',
  JOB_TITLE: '.gb-results-list__title strong',
  JOB_COMPANY: '.gb-results-list__info div strong',
  JOB_LOCATION: '.gb-results-list__info .location',
  JOB_PAYMENT_RANGE: '.fa.fa-money.tooltipster-basic.green',
  JOB_PUBLISHED_DATE: '.opacity-half.size0'
} as const

export const JOBS_CATEGORY = [
  'programacion',
  'sysadmin-devops-qa',
  'cybersecurity',
  'desarrollo-mobile'
] as const

export const months = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic"
];

const dateComparison = (date: string) => {
  const actualDate = new Date()
  const actualMonth = actualDate.getMonth()
  const actualDay = actualDate.getDate()

  const [day, month] = date.split(" ")
  const monthDate = day.toLowerCase()
  const dayDate = Number(month)

  const monthIndex = months.indexOf(monthDate)

  if ((actualMonth > monthIndex) || (actualMonth === monthIndex && actualDay >= dayDate)) {
    return actualDate.getFullYear()
  } else {
    return actualDate.getFullYear() - 1
  }

}

const scrape = async (category: typeof JOBS_CATEGORY[number]) => {
  const web = await fetch(`https://www.getonbrd.com/empleos/${category}?lang=es`)
  const html = await web.text()
  return cheerio.load(html)
}

const getListOfJobs = async (category: typeof JOBS_CATEGORY[number]) => {
  const $ = await scrape(category)
  const jobs: Job[] = []

  $(MAIN_LIST_SELECTORS.MAIN_JOB_CARD).each((i, el) => {
    const title = $(el).find(MAIN_LIST_SELECTORS.JOB_TITLE).text()
    const company = $(el).find(MAIN_LIST_SELECTORS.JOB_COMPANY).text()
    const location = $(el).find(MAIN_LIST_SELECTORS.JOB_LOCATION).text().replaceAll('\n', '').trim()
    const payment = $(el).find(MAIN_LIST_SELECTORS.JOB_PAYMENT_RANGE).attr('title') || null
    const published = $(el).find(MAIN_LIST_SELECTORS.JOB_PUBLISHED_DATE).text().trim()
    const url = $(el).attr('href')!

    const isHybrid = "El trabajo se desempeña algunos días de forma remota y otros en la oficina"
    const isPresential = "El trabajo debe ser desempeñado íntegramente de manera presencial"
    const year = dateComparison(published)

    const job: Job = {
      title,
      company,
      location: location.split('en: ')[1]
        ? location.split('en: ')[1].replace('(', ' (')
        : location.split(' ')[0].replace('El', '').replace('(', ' ('),
      modality: location.includes(isPresential)
        ? 'Presencial'
        : location.includes(isHybrid)
          ? 'Híbrido'
          : location.replace('(', ' ('),
      payment,
      published,
      year,
      url
    }

    jobs.push(job)
  })

  console.info(jobs.length + ' jobs generated ✨✨')
  return jobs.filter(job => job.year >= new Date().getFullYear())
}

function sortJobsByDate(jobs: Job[]) {
  return jobs.sort((a, b) => {
    const [dayA, monthA] = a.published.split(" ")
    const [dayB, monthB] = b.published.split(" ")

    const monthDateA = dayA.toLowerCase()
    const monthDateB = dayB.toLowerCase()

    const dayDateA = Number(monthA);
    const dayDateB = Number(monthB);

    const monthIndexA = months.indexOf(monthDateA)
    const monthIndexB = months.indexOf(monthDateB)

    return (
      new Date(b.year, monthIndexB, dayDateB).getTime() -
      new Date(a.year, monthIndexA, dayDateA).getTime()
    )
  });
}

const writeDBFile = (data: Job[]) => {
  const pathArr = [
    {
      path: './db/gob-jobs.json',
      data
    },
    {
      path: './db/info.json',
      data: { lastModified: +new Date() }
    }
  ]

  pathArr.forEach(async ({ path: _path, data }) => {
    const filePath = path.join(process.cwd(), _path)
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  })
}

(async () => {
  const allJobs: Job[] = []
  for (const category of JOBS_CATEGORY) {
    const jobs = await getListOfJobs(category)
    allJobs.push(...jobs)

    console.info(`✅ ${category} jobs done`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  const sortedJobs = sortJobsByDate(allJobs)
  writeDBFile(sortedJobs)
  console.info('DB updated successfully 🚀🚀')
})()
