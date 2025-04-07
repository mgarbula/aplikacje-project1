export async function postResponse(
    dataArray,
    href_fetch,
    href_redirect,
    consoleError,
    userError,
    errorP = null
) {
    /**
     * @param {Array} dataArray - Array with data to send
     * @param {string} href_fetch - Href to send data
     * @param {string} href_redirect - Href to redirect after success
     * @param {string} consoleError - Error displayed in console
     * @param {string} userError - Error displayed to user (in Polish)
     * @param {HTMLElement} errorP - <p> element to show error (optional)
     */
    const dataToSend = {};
    for (const item of dataArray) {
        dataToSend[item.key] = item.value;
    }

    try {
        const response = await fetch(href_fetch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        const data = await response.json();
        if (response.ok && data.success) {
            window.location.href = href_redirect;
        } else if (errorP != null) {
            errorP.textContent = data.error;
        }
    } catch (error) {
        console.error(`${consoleError}: ${error}`);
        if (errorP != null) {
            errorP.textContent = userError;
        }
    }
}
