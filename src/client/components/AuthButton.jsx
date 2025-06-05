const AuthButton = () => {
    const handleLogin = () => {
      if (window.electronAPI?.openAuthWindow) {
        window.electronAPI.openAuthWindow();
      } else {
        console.error("Electron API not available");
      }
    };
  
    return <button onClick={handleLogin}>Log in with Yale</button>;
  }
  
  export default AuthButton;