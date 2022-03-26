(function (d3) {
  'use strict';

  var renderGen = function (data) {
    var svg = d3.select("#pokeByGen");

    var xValue = [];
    var yValue = [];

    for (var i = 0; i < data.length; i++) {
      xValue.push(data[i][1]);
      yValue.push(data[i][0]);
    }


  svg.selectAll("rect")
      .data(xValue)
      .enter().append("rect")
      .attr("height", function(d, i) {return (d * 10)})
      .attr("width","40")
      .attr("x", function(d, i) {return (i * 60) + 25})
      .attr("y", function(d, i) {return 400 - (d * 2)});

      svg.selectAll("text")
      .data(yValue)
      .enter().append("text")
      .text(function(d) {return d})
             .attr("class", "text")
             .attr("x", function(d, i) {return (i * 60) + 25})
             .attr("y", function(d, i) {return 490});
  };

  var renderWeight = function (data) {
    var svg = d3.select("#pokeByWeight");

    var xValue = [];
    var yValue = [];

    for (var i = 0; i < data.length; i++) {
      xValue.push(data[i][1]);
      yValue.push(data[i][0]);
    }

  svg.selectAll("rect")
      .data(xValue)
      .enter().append("rect")
      .attr("height", function(d, i) {return (d * 10)})
      .attr("width","40")
      .attr("x", function(d, i) {return (i * 80) + 25})
      .attr("y", function(d, i) {return 400 - (d * 2)});

      svg.selectAll("text")
      .data(yValue)
      .enter().append("text")
      .text(function(d) {return d})
             .attr("class", "text")
             .attr("x", function(d, i) {return (i * 80) + 25})
             .attr("y", function(d, i) {return 490});
  };


  d3.json("./data/pokemon.json").then(function (data) {
    // Find pokemon with lowest hp using d3
    var lowestHP = data.reduce(function (prev, curr) {
      return curr.hp < prev.hp ? curr : prev;
    });
    var lowestHPSpan = d3.select("#lowestHp");
    lowestHPSpan.text(((lowestHP.name) + " has the lowest hp of " + (lowestHP.hp)));

    // Create a new list generationCounts that stores the counts of each generation in the dataset.
    var generationCounts = data.reduce(function (prev, curr) {
      if (prev[curr.generation]) {
        prev[curr.generation]++;
      } else {
        prev[curr.generation] = 1;
      }
      return prev;
    }, {});

    console.log("Generation count");
    console.log(generationCounts);

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

    // use primaryWeights to find the average weight of each type
    var primaryWeights = {};
    for (var type in typeWeights) {
      primaryWeights[type] = typeWeights[type] / typeCounts[type];
    }
    console.log("Type averages");
    console.log(primaryWeights);

    /* s Write a function filterHP  */
    var filterHP = function (data, minHP, maxHP) {
      return data.filter(function (pokemon) {
        return pokemon.hp >= minHP && pokemon.hp <= maxHP;
      });
    };
    console.log("Filtered HP");
    console.log(filterHP(data, 100, 200));

    /* n Create a list genAttackDefense , each of which stores a generation */
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
    console.log("Generation attack defense");
    console.log(genAttackDefense);

    // Make bar chart of generation counts
    renderGen(Object.entries(generationCounts));
    renderWeight(Object.entries(primaryWeights));
  });

})(d3);
//# sourceMappingURL=bundle.js.map
