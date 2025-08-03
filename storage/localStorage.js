function getSavedScorecards() {
    let savedScorecards = JSON.parse(localStorage.getItem("savedScorecards"), Scorecard.reviver);
    if (!savedScorecards) {
        savedScorecards = [];
    }
    return savedScorecards;
}

function saveScores(scorecard) {
    console.log("--- saveScores");
    let saveString = scorecard.getSaveString();
    // console.log(saveString);
    localStorage.setItem("scorecard", saveString);
}

function loadScores(defaultScoreCard, Scorecard) {
    // todo remove later
    {
        let scores = localStorage.getItem("scoreCard");
        if (scores) {
            localStorage.removeItem("scoreCard");
            localStorage.setItem("scorecard", scores);
        }
    }
    console.log("--- loadScores");
    let scores = localStorage.getItem("scorecard");
    if (scores) {
        return JSON.parse(scores, Scorecard.reviver);
    } else {
        return defaultScoreCard.clone();
    }
}

export { getSavedScorecards, saveScores, loadScores };
