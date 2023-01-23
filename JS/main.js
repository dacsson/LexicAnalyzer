import Analyzer from "./Classes/Analyzer.js"

let str = `
def findOdd(array):
    newArray = []
    for i in range(len(array)):
        if i % 2 != 0:
            newArray.push(i)

    return newArray

array = [1, 2, 3, 4, 5]
print(findOdd(array))
`

console.log(new Analyzer(str).Analyze())