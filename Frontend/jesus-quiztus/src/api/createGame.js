export async function createGame(formData, accessToken) {
  /**
   * Starts a new game by sending a POST request to the Supabase function.
   * Using authentication token for authorization.
   * sent via the headers.
   */
    const res = await fetch("https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/create-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });
  
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json.error || 'Error starting game');
      return json;
    } catch (e) {
      throw new Error('Server did not return valid JSON: ' + text);
    }
  }
  