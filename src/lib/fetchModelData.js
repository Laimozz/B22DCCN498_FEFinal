/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise<any>}  A Promise that resolves to the JSON data from the server or null on error.
 */
async function fetchModel(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error fetching model:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error fetching model:', error);
    return null;
  }
}

export default fetchModel;
