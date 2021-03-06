import {
  select,
  json,
} from "d3";

const typeEmoji = {
  Grass: "🌱",
  Fire: "🔥",
  Water: "💧",
  Bug: "🐛",
  Normal: "⚪",
  Dark: "🌑",
  Poison: "🐍",
  Electric: "⚡",
  Ground: "⛰️",
  Ice: "❄️",
  Fairy: "🧚",
  Steel: "⚙️",
  Fighting: "🥊",
  Psychic: "🔮",
  Rock: "🪨",
  Ghost: "👻",
  Dragon: "🐉",
  Flying: "🐦",
};

const renderGen = (data) => {
  const svg = select("#pokeByGen");

  let xValue = [];
  let yValue = [];

  for (let i = 0; i < data.length; i++) {
    xValue.push(data[i][1]);
    yValue.push(data[i][0]);
  }

  svg
    .selectAll("rect")
    .data(xValue)
    .enter()
    .append("rect")
    .attr("height", function (d, i) {
      return d * 10;
    })
    .attr("width", "40")
    .attr("x", function (d, i) {
      return i * 60 + 25;
    })
    .attr("y", function (d, i) {
      return 400 - d * 2;
    });

  svg
    .selectAll("text")
    .data(yValue)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("class", "text")
    .attr("x", function (d, i) {
      return i * 60 + 40;
    })
    .attr("y", function (d, i) {
      return 490;
    });
};

const renderWeight = (data) => {
  const svg = select("#pokeByWeight");

  let xValue = [];
  let yValue = [];

  for (let i = 0; i < data.length; i++) {
    xValue.push(data[i][1]);
    yValue.push(data[i][0]);
  }

  svg
    .selectAll("rect")
    .data(xValue)
    .enter()
    .append("rect")
    .attr("height", function (d, i) {
      return d * 10;
    })
    .attr("width", "40")
    .attr("x", function (d, i) {
      return i * 60 + 25;
    })
    .attr("y", function (d, i) {
      return 400 - d * 2;
    });

  svg
    .selectAll("text")
    .data(yValue)
    .enter()
    .append("text")
    .text(function (d) {
      return typeEmoji[d];
    })
    .attr("class", "text")
    .attr("x", function (d, i) {
      return i * 60 + 30;
    })
    .attr("y", function (d, i) {
      return 490;
    });
};

json("./data/pokemon.json").then((data) => {
  // Create a new list generationCounts that stores the counts of each generation in the dataset.
  const generationCounts = data.reduce((prev, curr) => {
    if (prev[curr.generation]) {
      prev[curr.generation]++;
    } else {
      prev[curr.generation] = 1;
    }
    return prev;
  }, {});

  const genCounts = select("#genCounts");
  let genStr = "| ";
  for (let gen in generationCounts) {
    genStr += `Gen ${gen}: ${generationCounts[gen]} | `;
  }
  genCounts.text(`${genStr}`);

  const typeWeights = data.reduce((prev, curr) => {
    if (prev[curr.primary_type]) {
      prev[curr.primary_type] += curr.weight_kg;
    } else {
      prev[curr.primary_type] = curr.weight_kg;
    }
    return prev;
  }, {});

  // Count the number of pokemon with each type
  const typeCounts = data.reduce((prev, curr) => {
    if (prev[curr.primary_type]) {
      prev[curr.primary_type]++;
    } else {
      prev[curr.primary_type] = 1;
    }
    return prev;
  }, {});

  const typeCountsSpan = select("#typeCounts");
  let typeStr = "| ";
  for (let type in typeCounts) {
    typeStr += `${typeEmoji[type]}: ${typeCounts[type]} | `;
  }
  typeCountsSpan.text(`${typeStr}`);

  // use primaryWeights to find the average weight of each type
  let primaryWeights = {};
  for (let type in typeWeights) {
    primaryWeights[type] = typeWeights[type] / typeCounts[type];
  }

  const typeAverages = select("#typeAverages");

  let typeAvgStr = "| ";
  for (let type in primaryWeights) {
    typeAvgStr += `${typeEmoji[type]}: ${Math.round(primaryWeights[type])} | `;
  }
  typeAverages.text(`${typeAvgStr}`);

  // Find pokemons with highest and lowest hp
  const highestHP = data.reduce((prev, curr) => {
    return curr.hp > prev.hp ? curr : prev;
  });
  let highestHPStr = `${highestHP.name} : ${highestHP.hp}`;
  const lowestHP = data.reduce((prev, curr) => {
    return curr.hp < prev.hp ? curr : prev;
  });
  let lowestHPStr = `${lowestHP.name} : ${lowestHP.hp}`;
  const hpSpan = select("#hp");
  hpSpan.text(`${highestHPStr} | ${lowestHPStr}`);

  // Find pokemons with highest and lowest height
  const highestHeight = data.reduce((prev, curr) => {
    return curr.height_m > prev.height_m ? curr : prev;
  });
  let highestHeightStr = `${highestHeight.name} : ${highestHeight.height_m}`;
  const lowestHeight = data.reduce((prev, curr) => {
    return curr.height_m < prev.height_m ? curr : prev;
  });
  let lowestHeightStr = `${lowestHeight.name} : ${lowestHeight.height_m}`;
  const heightSpan = select("#height");
  heightSpan.text(`${highestHeightStr} | ${lowestHeightStr}`);

  // Find pokemons with highest and lowest weight
  const highestWeight = data.reduce((prev, curr) => {
    return curr.weight_kg > prev.weight_kg ? curr : prev;
  });
  let highestWeightStr = `${highestWeight.name} : ${highestWeight.weight_kg}`;
  const lowestWeight = data.reduce((prev, curr) => {
    return curr.weight_kg < prev.weight_kg ? curr : prev;
  });
  let lowestWeightStr = `${lowestWeight.name} : ${lowestWeight.weight_kg}`;
  const weightSpan = select("#weight");
  weightSpan.text(`${highestWeightStr} | ${lowestWeightStr}`);

  // Find pokemons with highest and lowest attack
  const highestAttack = data.reduce((prev, curr) => {
    return curr.attack > prev.attack ? curr : prev;
  });
  let highestAttackStr = `${highestAttack.name} : ${highestAttack.attack}`;
  const lowestAttack = data.reduce((prev, curr) => {
    return curr.attack < prev.attack ? curr : prev;
  });
  let lowestAttackStr = `${lowestAttack.name} : ${lowestAttack.attack}`;
  const attackSpan = select("#attack");
  attackSpan.text(`${highestAttackStr} | ${lowestAttackStr}`);

  // Find pokemons with highest and lowest defense
  const highestDefense = data.reduce((prev, curr) => {
    return curr.defense > prev.defense ? curr : prev;
  });
  let highestDefenseStr = `${highestDefense.name} : ${highestDefense.defense}`;
  const lowestDefense = data.reduce((prev, curr) => {
    return curr.defense < prev.defense ? curr : prev;
  });
  let lowestDefenseStr = `${lowestDefense.name} : ${lowestDefense.defense}`;
  const defenseSpan = select("#defense");
  defenseSpan.text(`${highestDefenseStr} | ${lowestDefenseStr}`);

  // Find pokemons with highest and lowest speed
  const highestSpeed = data.reduce((prev, curr) => {
    return curr.speed > prev.speed ? curr : prev;
  });
  let highestSpeedStr = `${highestSpeed.name} : ${highestSpeed.speed}`;
  const lowestSpeed = data.reduce((prev, curr) => {
    return curr.speed < prev.speed ? curr : prev;
  });
  let lowestSpeedStr = `${lowestSpeed.name} : ${lowestSpeed.speed}`;
  const speedSpan = select("#speed");
  speedSpan.text(`${highestSpeedStr} | ${lowestSpeedStr}`);

  // Create a list genAttackDefense , each of which stores a generation
  const genAttackDefense = data.reduce((prev, curr) => {
    if (!prev[curr.generation]) {
      prev[curr.generation] = {
        attack: 0,
        defense: 0,
      };
    }
    prev[curr.generation].attack += curr.attack;
    prev[curr.generation].defense += curr.defense;
    return prev;
  }, {});
  const genAttackDefenseSpan = select("#genAttackDefense");
  let genAtkDef = "| ";
  for (let gen in genAttackDefense) {
    genAtkDef += `Gen ${gen}: Attack: ${genAttackDefense[gen].attack}, Defense: ${genAttackDefense[gen].defense} | `;
  }
  genAttackDefenseSpan.text(`${genAtkDef}`);

  const typeLegend = select("#typeLegend");
  let typeLegendStr = "| ";
  for (let type in typeEmoji) {
    typeLegendStr += `${typeEmoji[type]} : ${type} | `;
  }
  typeLegend.text(`${typeLegendStr}`);

  // Make bar chart of generation counts
  renderGen(Object.entries(generationCounts));
  renderWeight(Object.entries(primaryWeights));

  // Write a function filterHP
  const filterHP = (data, minHP, maxHP) => {
    return data.filter((pokemon) => {
      return pokemon.hp >= minHP && pokemon.hp <= maxHP;
    });
  };
  console.log("Pokemon with HP between 100 and 200:");
  console.log(filterHP(data, 100, 200));
});
