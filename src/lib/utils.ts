import { currencyOffIcon } from "@/lib/constants";
import type { Job } from "@/types";

export const centerRectOnScreen = (targetWidth: number, targetHeight: number) => {
  const left = (window.innerWidth - targetWidth) / 2 + window.screenLeft
  const top = (window.innerHeight - targetHeight) / 2 + window.screenTop
  return { width: targetWidth, height: targetHeight, left, top }
}

export const generateTableRow = (job: Job) => {
  return `
    <tr data-href=${job.url} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group cursor-pointer">
      <td class="relative p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 group-hover:underline underline-offset-2">
        ${job.title}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.company}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0 max-w-[30ch] truncate">
        ${job.location}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.modality}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.payment ?? `<span class="flex items-center gap-x-2">${currencyOffIcon} N/A</span>`}
      </td>
      <td class="relative p-4 align-middle [&:has([role=checkbox])]:pr-0">
        ${job.published}, ${job.year}
      </td>
    </tr>
  `.trim();
};

