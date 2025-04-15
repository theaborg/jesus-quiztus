let { data, error } = await supabase
  .rpc('insert_user')
if (error) console.error(error)
else console.log(data)