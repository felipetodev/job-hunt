import type { APIRoute } from 'astro'
import gobJobs from '../../../db/gob-jobs.json'

// const DEFAULT_JOB_OFFSET = '20'

export const GET: APIRoute = ({ request }) => {
  // const { url } = request
  // const searchParams = new URL(url).searchParams

  return new Response(JSON.stringify(gobJobs), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
