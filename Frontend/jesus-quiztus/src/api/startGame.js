export async function startGame(formData, accessToken) {
    const res = await fetch("https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/start-game", {
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
  