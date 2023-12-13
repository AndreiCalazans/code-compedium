async function fetchVaultDetails(vaultId) {
  const token = process.env.ONEPASSWORD_CONNECT_TOKEN;
  const serverUrl = process.env.ONEPASSWORD_CONNECT_SERVER_URL;

  try {
    const response = await fetch(`${serverUrl}/v1/vaults/${vaultId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items;
    console.log('Returned items', items):
    return items.map((item) => {
      return {
        username: item.fields?.find((field) => field.label === "username")
          ?.value,
        password: item.fields?.find((field) => field.label === "password")
          ?.value,
      };
    });
  } catch (error) {
    console.error("Error fetching vault details:", error);
    return null;
  }
}

// Example usage
fetchVaultDetails("your_vault_id_here").then((details) => {
  console.log(details);
});
