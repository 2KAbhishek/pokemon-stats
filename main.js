import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  json,
  min,
  mean,
} from "d3";

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
      return d;
    })
    .attr("class", "text")
    .attr("x", function (d, i) {
      return i * 60 + 25;
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

  // use primaryWeights to find the average weight of each type
  let primaryWeights = {};
  for (let type in typeWeights) {
    primaryWeights[type] = typeWeights[type] / typeCounts[type];
  }
  console.log("Type averages");
  console.log(primaryWeights);

  // Write a function filterHP
  const filterHP = (data, minHP, maxHP) => {
    return data.filter((pokemon) => {
      return pokemon.hp >= minHP && pokemon.hp <= maxHP;
    });
  };
  console.log("Filtered HP");
  console.log(filterHP(data, 100, 200));

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
  console.log("Generation attack defense");
  console.log(genAttackDefense);

  // Find pokemon with lowest hp using d3
  const lowestHP = data.reduce((prev, curr) => {
    return curr.hp < prev.hp ? curr : prev;
  });
  let lowestHPSpan = select("#lowestHp");
  lowestHPSpan.text(`${lowestHP.name} has the lowest hp of ${lowestHP.hp}`);

  // Make bar chart of generation counts
  renderGen(Object.entries(generationCounts));
  renderWeight(Object.entries(primaryWeights));
});
