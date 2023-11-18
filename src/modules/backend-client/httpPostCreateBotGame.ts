type Params = {
  strength: number,
  variant: number,
  timeMode: number,
}

export async function httpPostCreateBotGame({ strength, variant, timeMode }: Params) {
  const created_at = Date.now() / 1000; // in seconds
  const gameInfo = {strength, variant, time_mode: timeMode, created_at};
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/create-bot-game", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify(gameInfo),
  })

  if (!response.ok) {
    throw new Error("Create bot game not ok");
  } else {
    const body = await response.text();
    const responseData = JSON.parse(body);
    return responseData.data;
  }
}
