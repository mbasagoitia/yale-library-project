const handleRenewToken = async () => {
    const result = await window.api.auth.renewToken();
    return result;
  };

export default handleRenewToken;