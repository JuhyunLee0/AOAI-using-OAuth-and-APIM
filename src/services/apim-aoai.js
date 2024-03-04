
// default header
const defaultHeaders = {
    Accept: "application/json",
    "Access-Control-Allow-Origin": process.env.REACT_APP_REDIRECT_URI,
    "Content-Type": "application/json",
    // "User-Agent": "any-name"
};

const chatCompletion = async (token, model, messages) => {
  let url = `${process.env.REACT_APP_APIM_BASE_ENDPOINT}/deployments/${process.env.REACT_APP_AOAI_DEPLOYMENT_ID}/chat/completions?api-version=${process.env.REACT_APP_AOAI_API_VERSION}`;
  const headers = {
    ...defaultHeaders,
    Authorization: `Bearer ${token}`,
  };
  const raw = JSON.stringify({
    "model": model,
    "messages": [
      {
        "role": "user",
        "content": messages
        }
    ]
  });

  let resp = null;
  resp = await fetch(url, {
    method: "POST",
    headers,
    body: raw,
  });

  if(resp.ok) {
    let data = await resp.json();
    return data;
  }

  console.log('error', resp);
  return resp;

};


export default {
  chatCompletion,
};
