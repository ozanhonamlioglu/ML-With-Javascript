const outputs = []

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])
}

function runAnalysis() {
  const [testSet, trainingSet] = splitDataSet(outputs, 100);
  const kRange = 20;

  _.range(1, kRange).forEach(k => {
    const acc = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
    .size()
    .divide(testSet.length)
    .value();

    console.log(`Accuracy: ${acc}, K: ${k}`)
  })
}

function knn(data, point, k) {
  return _.chain(data)
  .map(x => ([distance(x[0], point), x[3]]))
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
  // pisagor teoremi uygulanarak uzaklık hesaplaması yapıyoruz.
  // işlemlerin sonunda training data ile test datasının uyuşma oranını gözden geçireceğiz.
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (b - a) ** 2)
    .sum()
    .value() ** 0.5;
}

function splitDataSet(data, testCount) {
  const shuffled = _.shuffle(data)

  const testSet = _.slice(shuffled, 0, testCount)
  const trainingSet = _.slice(shuffled, testCount)

  return [testSet, trainingSet]
}