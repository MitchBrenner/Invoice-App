import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Invoice } from "./types"
import jsPDF from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportPDF(form: any) {
  // Add code here
  const doc = new jsPDF();

  doc.setFontSize(12);

  // address in top left
  doc.text([
    'Boardman Conveyor',
    'E. 5029 HWY 33',
    'P.O. Box 343',
    'Reedsburg, WI 53959',
  ], 5, 10);


  // Get width of the page
  const pageWidth = doc.internal.pageSize.getWidth();

  // Get width of the text
  const textSize = doc.getTextWidth(form.id);

  // doc.setFont('times', 'bold');
  doc.text([
    'Invoice',
    `#${form.id}`,
  ], pageWidth - textSize, 10);


  // create blob
  const pdfBlob = doc.output('blob');

  // create data uri
  const url = URL.createObjectURL(pdfBlob);

  window.open(url, '_blank');

  return url;
}
