function fetchArr() {
  let inputElement = document.getElementById('inputArr');
  let inputArr = inputElement.value.split(',');
  const inputArr1 = inputArr.map(data => parseInt(data))
  calculateChart(inputArr1)
}

function tableCollapse() {
  const onlyWater = document.getElementById("BrickAndWater").style.borderCollapse

  if (onlyWater === "collapse") {
    document.getElementById("BrickAndWater").style.borderCollapse = "separate"
    document.getElementById("onlyWater").style.borderCollapse = "separate"
  }
  else {
    document.getElementById("BrickAndWater").style.borderCollapse = "collapse"
    document.getElementById("onlyWater").style.borderCollapse = "collapse"

  }

}

const calculateChart = (input) => {
  const wall = [];
  const absoluteWalls = [];
  const end = input.length - 1;
  const max = Math.max(...input)
  let image = [];
  let pre
  //create walls
  input.forEach((value, index) => {
    if (value != 0) {
      wall.push({ index, value });
    }
  });
  //create Absolute walls
  wall.forEach((data, index) => {
    if (pre === undefined) {
      pre = data.value;
      absoluteWalls.push({
        index: data.index,
        value: data.value,
        wallIndex: index,
      });
    } else if (data.value >= pre) {
      if (pre !== max) {
        pre = data.value;
        absoluteWalls.push({
          index: data.index,
          value: data.value,
          wallIndex: index,
        });
      }
    }
  });
  absoluteWalls.pop();
  const wallEnd = wall.length - 1;
  const afterMaxCenter = (array, start, end) => {
    let maxCenter;
    for (let index = start; index <= end; index++) {
      if (maxCenter === undefined) {
        maxCenter = Object.assign({}, array[index]);
        maxCenter['wallIndex'] = index;
      } else {
        if (wall[index].value > maxCenter.value) {
          maxCenter = Object.assign({}, array[index]);
          maxCenter['wallIndex'] = index;
        }
      }
    }
    absoluteWalls.push(maxCenter);
    if (maxCenter.wallIndex !== end) {
      afterMaxCenter(array, maxCenter.wallIndex + 1, end);
    }
  };
  afterMaxCenter(wall, 0, wallEnd);
  // creaeting image
  let absoluteWallIndex = 0
  image = input.map((data, index) => {
    if (index === 0 && data === 0) {
      return {
        water: 0,
        wall: 0,
        air: max
      }
    }
    else if (index === end && data === 0) {
      return {
        water: 0,
        wall: 0,
        air: max
      }
    }
    else {
      if (index === absoluteWalls[absoluteWallIndex].index) {
        // AbsoluteWallSecondary
        absoluteWallIndex++
        return {
          water: 0,
          wall: absoluteWalls[absoluteWallIndex - 1].value,
          air: max - absoluteWalls[absoluteWallIndex - 1].value
        }
      }
      else {
        if (absoluteWalls[absoluteWallIndex - 1].value < absoluteWalls[absoluteWallIndex].value) {
          if (data === 0) {
            return {
              water: absoluteWalls[absoluteWallIndex - 1].value,
              wall: data,
              air: max - absoluteWalls[absoluteWallIndex - 1].value
            }
          }
          else {
            const air = absoluteWalls[absoluteWallIndex - 1].value
            return {
              water: absoluteWalls[absoluteWallIndex - 1].value - data,
              wall: data,
              air: max - air
            }
          }
        }
        else {
          if (data === 0) {
            return {
              water: absoluteWalls[absoluteWallIndex].value,
              wall: 0,
              air: max - absoluteWalls[absoluteWallIndex].value
            }
          } else {
            const air = absoluteWalls[absoluteWallIndex].value
            return {
              water: absoluteWalls[absoluteWallIndex].value - data,
              wall: data,
              air: max - air
            }
          }
        }
      }
    }
  });

  const imageCopy = image.map(data => Object.assign({}, data))
  const BrickAndWater = document.createElement("table");
  BrickAndWater.className = "BrickAndWater"
  BrickAndWater.id = "BrickAndWater"
  const onlyWater = document.createElement("table");
  onlyWater.className = "onlyWater"
  onlyWater.id = "onlyWater"
  for (let index = max + 2; index > 0; index--) {
    const trBaW = document.createElement("tr");
    const trOW = document.createElement("tr");
    if (index > max) {
      for (let i = 0; i < image.length; i++) {
        const tdBaW = document.createElement("td");
        tdBaW.className = "air"
        trBaW.append(tdBaW)
        const tdOW = document.createElement("td");
        tdOW.className = "air"
        trOW.append(tdOW)
      }
    }
    else {
      for (let i = 0; i < image.length; i++) {
        const tdBaW = document.createElement("td");
        const tdOW = document.createElement("td");
        if (image[i].air != 0) {
          tdBaW.className = "air"
          tdOW.className = "air"
          --image[i].air
        }
        else if (image[i].water != 0) {
          tdBaW.className = "water"
          tdOW.className = "water"
          --image[i].water
        }
        else if (image[i].wall != 0) {
          tdBaW.className = "wall"
          tdOW.className = "air"
          --image[i].wall
        }
        trBaW.append(tdBaW)
        trOW.append(tdOW)
      }
    }
    BrickAndWater.append(trBaW)
    onlyWater.append(trOW)
  }
  let water = 0;
  imageCopy.forEach((data) => {
    water = water + data.water
  })
  document.getElementById('BAW').innerHTML = null
  document.getElementById('OW').innerHTML = null
  document.getElementById('WaterUnit').innerHTML = `Total Water Units Are ${water}`
  document.getElementById('BAW').append(BrickAndWater)
  document.getElementById('OW').append(onlyWater)
}





