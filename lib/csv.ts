import Papa from 'papaparse';
export async function fetchCSV<T=any>(url: string): Promise<T[]> {
  const text = await (await fetch(url)).text();
  const parsed = Papa.parse<T>(text, { header: true, skipEmptyLines: true });
  return (parsed.data || []) as T[];
}
