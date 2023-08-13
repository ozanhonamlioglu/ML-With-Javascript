const outputs = []

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])
}

function runAnalysis() {
  const testSize = 100;
  const k = 10;

  _.range(0, 3).forEach(feature => {

    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataSet(minMax(data, 1), testSize);

    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
    .size()
    .divide(testSet.length)
    .value();

    console.log(`Accuracy of feature of ${feature} is ${accuracy}`)
  })
}

function knn(traningSet, pointWithoutLabel, k) {
  return _.chain(traningSet)
  .map(row => {
    return [
      distance(_.initial(row), pointWithoutLabel),
      _.last(row)
    ]
  })
  .sortBy(x => x[0])
  .slice(0, k)
  .countBy(x => x[1])
  .toPairs()
  .sortBy(x => x[1])
  .last()
  .first()
  .parseInt()
  .value()
}

function distance(pointA, pointB) {
  // pythagorean theorem
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (b - a) ** 2)
    .sum()
    .value() ** 0.5;
}

function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);


  for (let i = 0; i < featureCount; i++) {
    
    const col = data.map(row => row[i]);

    const min = _.min(col);
    const max = _.max(col);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }

    // clonedData.map(row => {
    //   row[i] = (row[i] - min) / (max - min);
    //   return row;
    // })
  }

  return clonedData;

}

function splitDataSet(data, testCount) {
  const shuffled = _.shuffle(data)

  const testSet = _.slice(shuffled, 0, testCount)
  const trainingSet = _.slice(shuffled, testCount)

  return [testSet, trainingSet]
}