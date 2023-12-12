defmodule MyElixirPhoenixApp.Repo do
  use Ecto.Repo,
    otp_app: :myElixirPhoenixApp,
    adapter: Ecto.Adapters.Postgres
end
