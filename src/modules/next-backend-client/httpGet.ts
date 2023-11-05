// TODO: Error handling?
export async function httpGet(apiPath: string, searchParams?: URLSearchParams) {
  const fetchPath = `${process.env.NEXT_PUBLIC_BACKEND_URL}` +  (searchParams ? `/${apiPath}?${searchParams.toString()}` : `/${apiPath}`);
  const response = await fetch(fetchPath);
  const body = await response.text();
  const data = JSON.parse(body);
  return data;
}
