export const CreateUser = async (supabaseClient, nickname, corsHeaders) => {
  const { data, error } = await supabaseClient
    .from("Users")
    .insert({ nickname })
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};
