export async function GET(request, { params }) {
  // Handle the champion icons request here
  // You might want to serve static files or proxy the request to another server
  return new Response(JSON.stringify({ message: "Champion icons API route" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
