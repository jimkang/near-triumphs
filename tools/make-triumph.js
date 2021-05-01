var { execSync } = require("child_process");
var splitToWords = require("split-to-words");
var { pick } = require("probable");
var randomId = require("@jimkang/randomid")();
var fs = require("fs");

var deckLines = [
  "I bomb atomically, Socrates' philosophies and hypotheses",
  "Can't define how I be dropping these mockeries",
  "Lyrically perform armed robbery",
  "Flee with the lottery, possibly they spotted me",
  "Battle-scarred Shogun, explosion when my pen hits tremendous",
  "Ultraviolet shine blind forensics",
  "I inspect you through the future see millennium",
  "Killa Beez sold fifty gold, sixty platinum",
  "Shackling the masses with drastic rap tactics",
  "Graphic displays melt the steel like blacksmith", // rime can't match 'blacksmiths'
  "Black Wu jackets, Queen Beez ease the guns in",
  "Rumble with patrolmen, tear gas laced the function",
  "Heads by the score take flight, incite a war",
  "Chicks hit the floor, die hard fans demand more",
  "Behold the bold soldier, control the globe slowly",
  "Proceeds to blow, swinging swords like Shinobi",
  "Stomp grounds and pound footprints in solid rock",
  "Wu got it locked, performing live on your hottest block",
];

for (var i = 0; i < 20; ++i) {
  var newLines = deckLines.map(swapInSlantRhyme);
  fs.writeFileSync(
    `${__dirname}/../verses/triumph-${randomId(4)}.txt`,
    newLines.join("\n"),
    { encoding: "utf8" }
  );
}

function swapInSlantRhyme(line) {
  var words = splitToWords(line);
  var lastWord = words[words.length - 1];
  var results;
  try {
    results = execSync(
      `docker run jkang/prebuilt-rime node node_modules/rime/util/get-rime.js ${lastWord}`,
      { encoding: "utf8" }
    );
  } catch (error) {
    // Into the void
    return line;
  }

  const marker = "Words that match rhyme sequences:\n";
  if (results.includes(marker)) {
    let parts = results.split(marker);
    let alternates = JSON.parse(parts[1]);
    return line.slice(0, -lastWord.length) + pick(alternates).toLowerCase();
  }

  return line;
}
