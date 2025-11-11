export default function handler(_req:any, res:any) {
  res.json({
    ok: true,
    PRINT_API_URL: process.env.PRINT_API_URL,
    CAMPUS: process.env.NEXT_PUBLIC_CAMPUS_NAME
  });
}
