// This's used for dynamic route /computer/[slug]
// Since we're using `output: export` in next.config,
// all slugs should be known at build time.

type Params = {
  gameID: string;
}

type Response = {
  status: number,
  error?: string,
  data?: {
    "w": number,
    "b": number
  }
}

export async function httpGetPlayerTimeLeft({ gameID }: Params) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/api/get-timer-info/${gameID}`,
    { cache: "no-store" }
  ).then((res) => res.json()) as Response;
  if (response.status === 200 && response.data) {
    return {
      ok: true,     
      data: response.data
    };
  }
  else {
    return {
      ok: false,
      error: response.error ?? "Get player time left error"
    }
  }
}
