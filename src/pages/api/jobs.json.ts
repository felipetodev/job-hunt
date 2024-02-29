import type { APIRoute } from 'astro'
import gobJobs from '../../../db/gob-jobs.json'

export const GET: APIRoute = ({ request }) => {
  const { url } = request
  const searchParams = new URL(url).searchParams

  const title = searchParams.get('title')
  const modality = searchParams.get('modality')

  let jobsData = gobJobs

  if (title && !modality) {
    jobsData = gobJobs.filter((job) => job.title.toLowerCase().includes(title.toLowerCase()))
  }

  if (modality && !title) {
    jobsData = gobJobs.filter((job) => job.modality.toLowerCase().includes(modality.toLowerCase()))
  }

  if (title && modality) {
    jobsData = gobJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(title.toLowerCase()) &&
        job.modality.toLowerCase().includes(modality.toLowerCase())
    )
  }

  return new Response(JSON.stringify(jobsData), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
