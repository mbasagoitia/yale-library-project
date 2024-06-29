function splitString(inputString) {

    const parts = inputString.split(' ');

    if (parts.length < 4) {
        throw new Error('Input string does not have enough parts');
    }

    if (parts.length > 3) {
        parts[2] = parts.slice(2, 4).join(' ');
    }

    const resultArray = [
        parts[0],
        parts[1],
        parts[2],
        parts[3]
    ];

    return resultArray;
}

export default splitString;