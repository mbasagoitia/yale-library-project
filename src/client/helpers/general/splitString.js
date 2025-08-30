function splitString(inputString) {
    const parts = inputString.split(' ');

    if (parts.length < 4) {
        return;
    }

    if (parts.length > 4) {
        parts[2] = parts.slice(2, parts.length - 1).join(' ');
    }

    const resultArray = [
        parts[0],
        parts[1],
        parts[2],
        parts[parts.length - 1]
    ];

    return resultArray;
}

export default splitString;
