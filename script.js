(function (d3) {
  'use strict';

  var typeEmoji = {
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

  var renderGen = function (data) {
    var svg = d3.select("#pokeByGen");

    var xValue = [];
    var yValue = [];

    for (var i = 0; i < data.length; i++) {
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

  var renderWeight = function (data) {
    var svg = d3.select("#pokeByWeight");

    var xValue = [];
    var yValue = [];

    for (var i = 0; i < data.length; i++) {
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

  d3.json("./data/pokemon.json").then(function (data) {
    // Create a new list generationCounts that stores the counts of each generation in the dataset.
    var generationCounts = data.reduce(function (prev, curr) {
      if (prev[curr.generation]) {
        prev[curr.generation]++;
      } else {
        prev[curr.generation] = 1;
      }
      return prev;
    }, {});

    var genCounts = d3.select("#genCounts");
    var genStr = "| ";
    for (var gen in generationCounts) {
      genStr += "Gen " + gen + ": " + (generationCounts[gen]) + " | ";
    }
    genCounts.text(("" + genStr));

    var typeWeights = data.reduce(function (prev, curr) {
      if (prev[curr.primary_type]) {
        prev[curr.primary_type] += curr.weight_kg;
      } else {
        prev[curr.primary_type] = curr.weight_kg;
      }
      return prev;
    }, {});

    // Count the number of pokemon with each type
    var typeCounts = data.reduce(function (prev, curr) {
      if (prev[curr.primary_type]) {
        prev[curr.primary_type]++;
      } else {
        prev[curr.primary_type] = 1;
      }
      return prev;
    }, {});

    var typeCountsSpan = d3.select("#typeCounts");
    var typeStr = "| ";
    for (var type in typeCounts) {
      typeStr += (typeEmoji[type]) + ": " + (typeCounts[type]) + " | ";
    }
    typeCountsSpan.text(("" + typeStr));

    // use primaryWeights to find the average weight of each type
    var primaryWeights = {};
    for (var type$1 in typeWeights) {
      primaryWeights[type$1] = typeWeights[type$1] / typeCounts[type$1];
    }

    var typeAverages = d3.select("#typeAverages");

    var typeAvgStr = "| ";
    for (var type$2 in primaryWeights) {
      typeAvgStr += (typeEmoji[type$2]) + ": " + (Math.round(primaryWeights[type$2])) + " | ";
    }
    typeAverages.text(("" + typeAvgStr));

    // Find pokemons with highest and lowest hp
    var highestHP = data.reduce(function (prev, curr) {
      return curr.hp > prev.hp ? curr : prev;
    });
    var highestHPStr = (highestHP.name) + " : " + (highestHP.hp);
    var lowestHP = data.reduce(function (prev, curr) {
      return curr.hp < prev.hp ? curr : prev;
    });
    var lowestHPStr = (lowestHP.name) + " : " + (lowestHP.hp);
    var hpSpan = d3.select("#hp");
    hpSpan.text((highestHPStr + " | " + lowestHPStr));

    // Find pokemons with highest and lowest height
    var highestHeight = data.reduce(function (prev, curr) {
      return curr.height_m > prev.height_m ? curr : prev;
    });
    var highestHeightStr = (highestHeight.name) + " : " + (highestHeight.height_m);
    var lowestHeight = data.reduce(function (prev, curr) {
      return curr.height_m < prev.height_m ? curr : prev;
    });
    var lowestHeightStr = (lowestHeight.name) + " : " + (lowestHeight.height_m);
    var heightSpan = d3.select("#height");
    heightSpan.text((highestHeightStr + " | " + lowestHeightStr));

    // Find pokemons with highest and lowest weight
    var highestWeight = data.reduce(function (prev, curr) {
      return curr.weight_kg > prev.weight_kg ? curr : prev;
    });
    var highestWeightStr = (highestWeight.name) + " : " + (highestWeight.weight_kg);
    var lowestWeight = data.reduce(function (prev, curr) {
      return curr.weight_kg < prev.weight_kg ? curr : prev;
    });
    var lowestWeightStr = (lowestWeight.name) + " : " + (lowestWeight.weight_kg);
    var weightSpan = d3.select("#weight");
    weightSpan.text((highestWeightStr + " | " + lowestWeightStr));

    // Find pokemons with highest and lowest attack
    var highestAttack = data.reduce(function (prev, curr) {
      return curr.attack > prev.attack ? curr : prev;
    });
    var highestAttackStr = (highestAttack.name) + " : " + (highestAttack.attack);
    var lowestAttack = data.reduce(function (prev, curr) {
      return curr.attack < prev.attack ? curr : prev;
    });
    var lowestAttackStr = (lowestAttack.name) + " : " + (lowestAttack.attack);
    var attackSpan = d3.select("#attack");
    attackSpan.text((highestAttackStr + " | " + lowestAttackStr));

    // Find pokemons with highest and lowest defense
    var highestDefense = data.reduce(function (prev, curr) {
      return curr.defense > prev.defense ? curr : prev;
    });
    var highestDefenseStr = (highestDefense.name) + " : " + (highestDefense.defense);
    var lowestDefense = data.reduce(function (prev, curr) {
      return curr.defense < prev.defense ? curr : prev;
    });
    var lowestDefenseStr = (lowestDefense.name) + " : " + (lowestDefense.defense);
    var defenseSpan = d3.select("#defense");
    defenseSpan.text((highestDefenseStr + " | " + lowestDefenseStr));

    // Find pokemons with highest and lowest speed
    var highestSpeed = data.reduce(function (prev, curr) {
      return curr.speed > prev.speed ? curr : prev;
    });
    var highestSpeedStr = (highestSpeed.name) + " : " + (highestSpeed.speed);
    var lowestSpeed = data.reduce(function (prev, curr) {
      return curr.speed < prev.speed ? curr : prev;
    });
    var lowestSpeedStr = (lowestSpeed.name) + " : " + (lowestSpeed.speed);
    var speedSpan = d3.select("#speed");
    speedSpan.text((highestSpeedStr + " | " + lowestSpeedStr));

    // Create a list genAttackDefense , each of which stores a generation
    var genAttackDefense = data.reduce(function (prev, curr) {
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
    var genAttackDefenseSpan = d3.select("#genAttackDefense");
    var genAtkDef = "| ";
    for (var gen$1 in genAttackDefense) {
      genAtkDef += "Gen " + gen$1 + ": Attack: " + (genAttackDefense[gen$1].attack) + ", Defense: " + (genAttackDefense[gen$1].defense) + " | ";
    }
    genAttackDefenseSpan.text(("" + genAtkDef));

    var typeLegend = d3.select("#typeLegend");
    var typeLegendStr = "| ";
    for (var type$3 in typeEmoji) {
      typeLegendStr += (typeEmoji[type$3]) + " : " + type$3 + " | ";
    }
    typeLegend.text(("" + typeLegendStr));

    // Make bar chart of generation counts
    renderGen(Object.entries(generationCounts));
    renderWeight(Object.entries(primaryWeights));

    // Write a function filterHP
    var filterHP = function (data, minHP, maxHP) {
      return data.filter(function (pokemon) {
        return pokemon.hp >= minHP && pokemon.hp <= maxHP;
      });
    };
    console.log("Pokemon with HP between 100 and 200:");
    console.log(filterHP(data, 100, 200));
  });

})(d3);
//# sourceMappingURL=script.js.map
