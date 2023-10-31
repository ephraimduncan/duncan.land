export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      request: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers),
        body: await request.text(),

        // @ts-ignore
        cookies: Object.fromEntries(request.cookies),
      },
    })
  );
}
