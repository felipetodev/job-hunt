import type { Job } from "@/types";

const svg = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 h-4"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path
      d="M16.7 8a3 3 0 0 0 -2.7 -2h-4m-2.557 1.431a3 3 0 0 0 2.557 4.569h2m4.564 4.558a3 3 0 0 1 -2.564 1.442h-4a3 3 0 0 1 -2.7 -2"
    ></path><path d="M12 3v3m0 12v3"></path><path d="M3 3l18 18"></path></svg
  >
`.trim();

export const generateTableRow = (job: Job) => {
  return `
    <tr data-href=${job.url} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group cursor-pointer">
      <td class="relative p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 group-hover:underline underline-offset-2">
        ${job.title}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.company}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.location}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.modality}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.payment ?? `<span class="flex items-center gap-x-2">${svg} N/A</span>`}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.published}, ${job.year}
      </td>
    </tr>
  `.trim();
};
