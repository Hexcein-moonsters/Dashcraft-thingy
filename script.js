const banlist = ["SkyRacer99", "-DTG-Dusty.", "1stPeenuut", "game_oversight", "-MrY-", "decky12582"];

function main() {
    ID = document.getElementById("IDinput").value;
    ID = ID.replaceAll("/", "");
    ID = ID.slice(ID.length - 24);
    fetch("https://api.dashcraft.io/track/" + ID + "?supportsLaps1=true")
        .then((response) => response.json())
        .then((json) => sendOut(json));

    fetch("https://cdn.dashcraft.io/track/" + ID + ".json")
        .then((response) => response.json())
        .then((json) => sendPieces(json));
}

function createDropdown(playerName, recordList) {
    dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    button = document.createElement("button");
    button.className = "dropbtn";
    button.innerHTML = playerName;
    dropdown.appendChild(button);

    dropContent = document.createElement("div");
    dropContent.className = "dropdown-content";

    for (let i = 0; i < recordList.length; i++) {
        listItem = document.createElement("a");
        listItem.target = "_blank";
        listItem.href = "https://dashcraft.io/?t=" + recordList[i][0];
        listItem.innerHTML = recordList[i][1];
        dropContent.appendChild(listItem);
    }

    dropdown.appendChild(dropContent);

    document.getElementById("recordList").appendChild(dropdown);
    document.getElementById("recordList").appendChild(document.createElement("br"));

}


function sendOut(response) {
    trackname = response.name;
    plays = response.plays;
    likes = response.upvotesCount;
    dislikes = response.downvotesCount;
    verified = response.verified;
    created = response.createdAt;
    lb = response.leaderboard;
    creator = response.user.username;

    document.getElementById("p1").innerHTML = "<u>Name:</u> " + trackname + "<br><u>Created By:</u> " + creator + "<br><u>Plays:</u> " + plays + "<br><u>Likes:</u> " + likes + "<br><u>Dislikes:</u> " + dislikes + "<br><u>Verified:</u> " + verified.toString() + "<br><u>Creation Date:</u> " + created;

    lbstr = "<u>username -- time (seconds)</u><br>";
    for (let i = 0; i < lb.length; i++) {
        lbstr += lb[i].userId.username + " -- " + lb[i].time + "<br>";
    }
    document.getElementById("p3").innerHTML = lbstr;
}

function sendPieces(response) {
    pieces = response.trackPieces;
    piecelist = [];

    for (let i = 0; i < pieces.length; i++) {
        piecelist.push(pieces[i].id);
    }
    piecedict = condenseBasic(piecelist);
    piecekeys = valueSort(piecedict);

    text = "<b><u>Total pieces:</u> " + piecelist.length.toString() + "</b><br>";
    for (let i = 0; i < piecekeys.length; i++) {
        text += "<u>" + getPieceText(piecekeys[i]) + ":</u> " + piecedict[piecekeys[i]].toString()
        text += "<br>"
    }
    document.getElementById("p2").innerHTML = text;
}

function condense(arr) {
    const counts = {};
    console.log(arr);
    for (const num of arr) {
        if (num === undefined) {
            continue;
        }
        if (counts[num[0]]) {
            counts[num[0]].push(num[1]);
            continue;
        }
        counts[num[0]] = [num[1], ];
    }
    console.log(counts);
    return counts;
}


function condenseBasic(arr) {
    const counts = {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}


function getPieceText(ID) {
    allpieces = {
        1: "start",
        2: "finish",
        3: "short straight",
        4: "medium straight",
        5: "long straight",
        6: "small turn",
        7: "medium turn",
        8: "big turn",
        9: "large turn",
        10: "short climb",
        11: "medium climb",
        12: "ramp small",
        13: "ramp medium",
        14: "ramp large",
        15: "curb 1",
        16: "curb 2",
        17: "curb 3",
        18: "vertical",
        19: "horizontal",
        20: "slope",
        21: "ramp 1",
        22: "ramp 2",
        23: "loop",
        24: "xs climb",
        25: "vertical 90",
        26: "loop with borders",
        27: "straight border left",
        28: "oblique",
        29: "curved inside",
        30: "curved outside",
        31: "no border",
        32: "pipe vertical",
        33: "pipe horizontal",
        34: "pipe curb 1",
        35: "pipe curb 2",
        38: "arrows right",
        39: "arrows left",
        40: "booth side",
        41: "booth corner",
        42: "booth middle",
        43: "ramp 1 border left",
        44: "ramp 2 border left",
        45: "slope border left",
        46: "ramp 1 no border",
        47: "ramp 2 no border",
        48: "slope no border",
        49: "tiny straight",
        50: "slope border right",
        51: "ramp 1 border right",
        52: "ramp 2 border right",
        53: "slope 90",
        54: "straight border right",
        55: "water side",
        57: "water corner",
        58: "water middle",
        59: "trees",
        60: "small right snake",
        61: "small left snake",
        62: "medium right snake",
        63: "medium left snake",
        64: "big right snake",
        65: "big left snake",
        66: "hill middle",
        67: "hill side",
        68: "hill corner",
        69: "tiny incline",
        70: "short incline",
        71: "transition right",
        72: "transition left",
        73: "bank right",
        74: "bank left",
        75: "right climb",
        76: "left climb"
    };
    return allpieces[ID];
}


function valueSort(dict) {
    var items = Object.keys(dict).map(
        (key) => {
            return [key, dict[key].length]
        });

    items.sort(
        (first, second) => {
            return second[1] - first[1]
        }
    );

    var keys = items.map(
        (e) => {
            return e[0]
        });

    return keys;
}

async function wrCount(countAll) {
    document.getElementById("loading").innerHTML = "loading... please wait about 10 seconds";
    document.getElementById("recordList").innerHTML = "";

    if (countAll) {
        document.getElementById("loading").innerHTML = "loading... you may have to wait a while for this one";
    }

    var fetches = [];
    var URL1 = "https://api.dashcraft.io/track/verified/";
    if (countAll) {
        URL1 = "https://api.dashcraft.io/track/global/";
    }

    if (!countAll) {
        var IDarr = [];
        I = 0;
        while (true) {
            IDL = await fetch(URL1 + I + "/50?sort=2");
            IDL = await IDL.json()

            if (IDL.length == 0) {
                break;
            }

            for (let i = 0; i < IDL.length; i++) {
                IDarr.push(IDL[i]._id);
            }

            I += 1;
        }

        console.log(IDarr);
        IDtoPlayers(IDarr);

    } else {

        var IDarr = [];

        var maxPages = 5000;
        var minPage = 0;
        var maxPage = maxPages;
        var threshold = 5;
        var amountOfPages = 0

        var I = 0;
        var core_amount = 0; // initial
        var roundingLosses = 0; // initial
        let batchAmount = 20 // seperate into batches.

        var loadCounter = document.getElementById("loadingNum");
        var loadProgress = 0;

        async function fetchTracks(startIndex) {
            var IDL = await fetch(URL1 + startIndex + "/50?sort=2");
            IDL = await IDL.json();

            return IDL.map(track => track._id);
        }

        async function guessAmountOfTracks() {

            while (minPage < maxPage) {
                var middlePage = Math.floor((minPage + maxPage) / 2);

                console.log("Currently getting page", middlePage)
                var results = await fetchTracks(middlePage);

                if (results.length === 0) {
                    maxPage = middlePage - 1;
                } else {
                    minPage = middlePage;

                    // start making individual requests
                    if (maxPage - minPage < threshold) {
                        console.log("Found a range smaller than threshold. Initiating individual requests.");

                        while (true) {
                            var individualResults = await fetchTracks(minPage);

                            console.log("Individual page", minPage)

                            // Break the loop if an empty array is found
                            if (individualResults.length === 0) {
                                break;
                            }

                            minPage++;
                        }

                        break; // stop when all individual requests are done
                    }
                }
            }
            minPage -= 1 // avoid getting the #page of the empty page.
            console.log("Found the page with a mix of empty and non-empty results:", minPage);
            return minPage
        }

        async function setCoreAmount() {
            amountOfPages = await guessAmountOfTracks();
            core_amount = amountOfPages

            roundingLosses = Math.ceil(core_amount % batchAmount);
            core_amount = Math.ceil(core_amount / batchAmount);
        }

        setCoreAmount().then(() => {
            fetchAllTracks(); // Set the number of requests at the same time to the amount of tracks

        });


        async function fetchAllTracks() {
            let time = performance.now()
            var I2 = 0

            while (true) {
                var promises = [];
                I2++
                if (I2 == batchAmount) { // last batch

                    for (let i = 0; i < core_amount - roundingLosses; i++) {
                        promises.push(fetchTracks(I));
                        I += 1;
                        console.log("last track fetch");
                        loadProgress += 1;
                        loadCounter.innerHTML = "loading track ID's... " + (loadProgress / amountOfPages * 100).toFixed(3) + `% <br> (${loadProgress}/${amountOfPages})`;

                    }
                } else {

                    for (let i = 0; i < core_amount; i++) {
                        promises.push(fetchTracks(I));
                        I += 1;
                        console.log("next track fetch");
                        loadProgress += 1;
                        loadCounter.innerHTML = "loading track ID's... " + (loadProgress / amountOfPages * 100).toFixed(3) + `% <br> (${loadProgress}/${amountOfPages})`;

                    }
                }

                var results = await Promise.all(promises);
                console.log("next batch")

                // Push arrays directly into IDarr
                IDarr.push(...results);

                if (results.some(result => result.length === 0)) {
                    console.error("This shouldn't activate anymore... \nDid the track amount function fail?")
                    break;
                }
                if (I2 == batchAmount) {
                    // last batch, no need to run a batch again
                    // run the last pages that don't fit in the batch size.
                    for (; I < amountOfPages; I++) {
                        loadProgress += 1;
                        loadCounter.innerHTML = "loading track ID's... " + (loadProgress / amountOfPages * 100).toFixed(3) + `% <br> (${loadProgress}/${amountOfPages})`;

                        let result = await fetchTracks(I)
                        IDarr.push(...result);

                        if (results.some(result => result.length === 0)) {
                            console.error("This shouldn't activate anymore... \nDid the track amount function fail?")
                        }
                    }
                    break
                }
            }
            IDarr = IDarr.flat();
            console.log(IDarr);
            console.log("Total time to fetch:", (performance.now() - time) / 1000)

            IDtoPlayers(IDarr);

        }


    }
}

function IDtoPlayers(IDs) {
    var IDCount = IDs.length;
    console.log(IDCount)
    setTimeout(function() {
        var loadCounter = document.getElementById("loadingNum");
        var loadProgress = 0;

        var fetches = [];
        var checkCheats = document.getElementById("cheatFilter").checked;
        for (let ID = 0; ID < IDs.length; ID++) {
            try {
                fetcH = fetch("https://api.dashcraft.io/track/" + IDs[ID] + "?supportsLaps1=true")
                    .then((response) => response.json())
                    .then((json) => {
                        jsonLB = json.leaderboard;
                        var trackName = json.name;
                        if (trackName == "") {
                            trackName = "Unnamed Track"
                        }
                        var track = [json._id, trackName];

                        for (let v = 0; v < jsonLB.length; v++) {
                            var username = jsonLB[v].userId.username;

                            var time = jsonLB[v].time;
                            if (!checkCheats) {
                                loadProgress += 1;
                                loadCounter.innerHTML = "loading... " + (loadProgress / IDCount * 100).toFixed(3) + `% <br> (${loadProgress}/${IDCount})`;
                                return [username, track];
                            } else if (!(banlist.includes(username) /* || (Math.round(time) == time)*/ )) {
                                loadProgress += 1;
                                loadCounter.innerHTML = "loading... " + (loadProgress / IDCount * 100).toFixed(3) + `% <br> (${loadProgress}/${IDCount})`;
                                return [username, track];
                            } else {
                                console.log(username + " -- " + IDs[ID])
                            }
                        }
                        if (jsonLB.length == 0) {
                            loadProgress += 1;
                            loadCounter.innerHTML = "loading... " + (loadProgress / IDCount * 100).toFixed(3) + `% <br> (${loadProgress}/${IDCount})`;
                            return ["Empty Leaderboard", track]
                        }

                    })
                fetches.push(fetcH);
            } catch (error) {
                console.log(error);
            }
        }

        Promise.all(fetches)
            .then((users) => {
                recorddict = condense(users);
                indexlist = valueSort(recorddict);

                for (let i = 0; i < indexlist.length; i++) {
                    createDropdown(indexlist[i] + ": " + recorddict[indexlist[i]].length.toString(), recorddict[indexlist[i]]);
                }

                document.getElementById("loading").innerHTML = "";
                document.getElementById("loadingNum").innerHTML = "";
                console.log(indexlist);
                console.log(recorddict);

                dataList = [];

                for (let i = 0; i < indexlist.length; i++) {
                    dataDict = {
                        'x': indexlist[i],
                        'y': recorddict[indexlist[i]].length
                    };
                    dataList.push(dataDict);
                }

                displayPie(dataList);

            });
    }, 100000)
}
// end of function


function displayPie(theData) {
    var pie = new ej.charts.AccumulationChart({
        //Initializing Series
        series: [{
            dataSource: theData,
            dataLabel: {
                visible: true,
                position: 'Inside',
                font: {
                    fontWeight: '600',
                    color: 'white'
                }
            },
            xName: 'x',
            yName: 'y'
        }],

        tooltip: {
            enable: true,
            header: 'all tracks',
            format: '${point.x}:<b> ${point.y} records<b>'
        },

        legendSettings: {
            visible: false,
        },
        background: 'DDCCEE',
        legendSettings: {
            height: '400',
            width: '200',
            textStyle: {
                color: 'white'
            }
        }

    });

    document.getElementById("container").innerHTML = "";
    pie.appendTo('#container');
}
