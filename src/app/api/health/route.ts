export function GET() {
  return Response.json({ status: "ok", service: "web", database: "not_checked" });
}
