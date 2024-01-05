type Params = {
  userId: number
}

export async function httpPostCreateHumanGame({ userId }: Params) {
  const created_at = Date.now() / 1000; // in seconds
  const gameInfo = {userId, created_at};
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/create-human-game", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify(gameInfo),
  })

  if (!response.ok) {
    throw new Error("Create human game not ok");
  } else {
    const body = await response.text();
    const responseData = JSON.parse(body);
    return responseData.data;
  }
}
