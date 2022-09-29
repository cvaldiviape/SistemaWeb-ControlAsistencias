// eslint-disable-next-line import/no-cycle

const baseFetch = (url, method = "get", body) => {
    return new Promise((resolve, reject) => {
        window.fetch(process.env.REACT_APP_API_ENDPOINT + url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body
        }).then((response) => {
            if(response.status === 404) {
                window.warn(`404 message back from server for url: ${url}, sending to 404 page`);
                document.location = "/404";
            } else if( response.status === 401) {
                window.warn(`Received a 401 from url: ${url}, sending to the home page for the user to log back in`);
                document.location = "/";
            }
            else if( response.status === 200) {
                response.text().then( text => {
                    resolve(text.length === 0 ? [] : JSON.parse(text));
                })
            }
            else {
                console.error(`Non-200 message back from server for url: ${url} received response: ${response.status}, ${response.statusText}, sending to error page`);
                document.location = "/Error";
            }
            
        }).catch(error => {
            console.log('caught an error fetch', error);
            if(error.name !== "AbortError") {
                reject(new Error(`Error fetching from ${url}`, error));
            }
        })
    })
}

export default baseFetch;