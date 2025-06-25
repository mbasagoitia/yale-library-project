const scrollToRequiredWarning = () => {
    const warning = document.querySelector("#required-fields-warning");
    if (warning) {
      warning.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToCallWarning = () => {
    const warning = document.querySelector("#required-call-fields-warning");
    if (warning) {
      warning.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

export { 
    scrollToCallWarning,
    scrollToRequiredWarning
 }