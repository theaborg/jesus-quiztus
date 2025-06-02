export const updateUserNickname = async (
  supabaseClient,
  userId,
  nickname,
  corsHeaders
) => {
  const { error } = await supabaseClient
    .from("users")
    .update({ nickname })
    .eq("id", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders,
  });
};
