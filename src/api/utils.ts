export async function apiRequest(
  url: string,
  method = 'GET',
  params: string[] | string = '',
  body?: Record<string, any>
) {
  //TODO add authentification token if exists

  const queryParams = params
    ? `?${
        typeof params == 'string' ? params : params.filter((p) => p).join('&')
      }`
    : '';

  return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}${queryParams}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body:
      !['GET', 'DELETE'].includes(method) && body
        ? JSON.stringify(body)
        : undefined,
  })
    .then((response) => response.json())
    .catch((error) => console.error('api error', error));
}
