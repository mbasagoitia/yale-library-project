const handleRenewToken = async () => {
    const result = await window.api.auth.renewToken();
  
    if (result.success) {
      console.log('Token renewed:', result.token);
    } else {
      console.error('Token renewal failed:', result.message);
    }
  };

export default handleRenewToken;