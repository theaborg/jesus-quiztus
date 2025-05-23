export const CreateUser = async (supabase, name, nickname) => {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ name, nickname }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
});