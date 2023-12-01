// This's used for dynamic route /computer/[slug]
// Since we're using `output: export` in next.config,
// all slugs should be known at build time.

type Response = {
  code: number,
  message: string,
  data: string[], // List of slugs
}

export async function httpGetAllGameSlugs(): Promise<string[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/all-game-slugs",
    { cache: "no-store" }
  ).then((res) => res.json());
  if (response.message === "Success") {
    return response.data;
  }
  else {
    throw new Error(response.message ?? "Get game slugs error");
  }
}
