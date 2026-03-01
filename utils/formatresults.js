module.exports = formatResults;

const pb = {
    leGreen: '<:LEgreen:1278709696060194846>',
    meGreen: '<:MEgreen:1278709693736292403>',
    reGreen: '<:REgreen:1278709690968309854>',
    lfGreen: '<:LFgreen:1278709703790297099>',
    mfGreen: '<:MFgreen:1278709706168467457>',
    rfGreen: '<:RFgreen:1278709708399575215>',
    leRed: '<:LEred:1278709681182867476>',
    meRed: '<:MEred:1278709678666289256>',
    reRed: '<:REred:1278709676149575764>',
    lfRed: '<:LFred:1278709683699585085>',
    mfRed: '<:MFred:1278709686115368960>',
    rfRed: '<:RFred:1278709688430755901>',
};

function calculateColor(upvotePercentage, downvotePercentage) {
    if (upvotePercentage === 0) {
        return 'red'; // All downvotes, set to red
    } else if (downvotePercentage === 0) {
        return 'green'; // All upvotes, set to green
    } else {
        return 'mixed'; // Mixed votes, set to a mix of green and red
    }
}

function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 26; // Set the length to 26

    const upvotePercentage = upvotes.length / totalVotes;
    const downvotePercentage = downvotes.length / totalVotes;

    const color = calculateColor(upvotePercentage, downvotePercentage);

    const halfProgressBarLength = progressBarLength / 2;
    const filledSquaresGreen = Math.min(Math.round(upvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;
    const filledSquaresRed = Math.min(Math.round(downvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;

    const upPercentage = upvotePercentage * 100 || 0;
    const downPercentage = downvotePercentage * 100 || 0;

    const progressBar =
        color === 'red'
            ? pb.lfRed + pb.mfRed.repeat(halfProgressBarLength) + pb.rfRed
            : color === 'green'
            ? pb.lfGreen + pb.mfGreen.repeat(halfProgressBarLength) + pb.rfGreen
            : (filledSquaresGreen ? pb.lfGreen : pb.leGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.rfRed : pb.reRed);

    const results = [];
    results.push(
        `:thumbsup: ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • :thumbsdown: ${
            downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
}

module.exports = formatResults;
