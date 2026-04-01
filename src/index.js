async function fetchIndex() {
    let result = await fetch('https://groep40.webdev.stud.atlantis.ugent.be/').then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for users failed with status ' + response.status);
        }
    });
    return result.json();
}

export default fetchIndex;