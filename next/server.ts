export class NextResponse extends Response {
  static json(body: any, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    })
  }
}
