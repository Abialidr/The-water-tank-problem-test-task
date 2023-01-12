function fetchArr() {
  let inputElement = document.getElementById('inputArr');
  let inputArr = inputElement.value.split(',');
  waterAndBricks(inputArr);
}

  function createTable(xaxisinput, outputArr, id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    });
    var option;
    option = {
      xAxis: {
        type: 'category',
        data: xaxisinput,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: outputArr,
          type: 'bar',
        },
      ],
    };
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
    window.addEventListener('resize', myChart.resize);
  }

  const countWaterUnits = (finalCase) => {
    let sum = 0;
    for (let i = 0; i < finalCase.length; i++) {
      let element = finalCase[i];
      if (element != '-') {
        sum += +element;
      }
    }
    return sum;
  };

  function waterAndBricks(bricks) {
    let finalCase = [];
    let firstCase = [];
    let secondCase = [];
    let result = [];
    let lastValueForFirstCase = 0;
    let lastValueForSecondCase = 0;
    for (let i = 0; i < bricks.length; i++) {
      let element = bricks[i];
      if (element == 0) {
        firstCase.push(lastValueForFirstCase);
      } else {
        firstCase.push('-');
        lastValueForFirstCase = element;
      }
    }
    for (let i = bricks.length - 1; i >= 0; i--) {
      let element = bricks[i];
      if (element == 0) {
        secondCase[i] = lastValueForSecondCase;
      } else {
        secondCase[i] = '-';
        lastValueForSecondCase = element;
      }
    }
    for (let i = 0; i < bricks.length; i++) {
      let fc = firstCase[i];
      let sc = secondCase[i];
      if (fc == '-') {
        finalCase[i] = '-';
      } else {
        finalCase[i] = fc - sc > 0 ? sc : fc;
      }
    }
    for (let i = 0; i < bricks.length; i++) {
      let element = bricks[i];
      if (element == 0) {
        result.push({
          value: finalCase[i],
          itemStyle: {
            color: '#0000FF',
          },
        });
      } else {
        result.push({
          value: element,
          itemStyle: {
            color: '#FFFF00',
          },
        });
      }
    }

    const bricksAndWater = result.map((data) => {
      return Object.assign({}, data);
    });

    const brickAndWaterArray = result.map((data) => {
      return data.value;
    });

    const onlyWater = result.map((data) => {
      if (data.itemStyle.color === '#FFFF00') {
        data.value = 0;
        return data;
      }
      return data;
    });

    const onlyWaterArray = result.map((data) => {
      return data.value;
    });

    createTable(brickAndWaterArray, bricksAndWater, 'chart-container');
    createTable(onlyWaterArray, onlyWater, 'chart-container1');
    document.getElementById('Water').innerHTML = 'Chart Containing only Water';
    document.getElementById('brickAndWater').innerHTML =
      'Chart Containing Water and Bricks';

    document.getElementById('waterunit').innerHTML = `Total ${countWaterUnits(
      finalCase
    )} Water Units`;
  }
