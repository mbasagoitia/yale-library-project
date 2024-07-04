const renderIdAndNumber = (data) => {
    if (data?.identifier_value && data?.number) {
      return <span>{data.identifier_value}/{data.number}</span>;
    } else if (data?.identifier_value) {
      return <span>{data.identifier_label} {data.identifier_value}</span>;
    }
    return null;
  };

export default renderIdAndNumber;