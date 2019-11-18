//add row to table
document.getElementById("addTask").addEventListener("click", addTask)
function addTask(){
    var table = document.getElementById("inputTable").getElementsByTagName('tbody')[0];
    var row = table.insertRow();

    var children = document.getElementById("inputTable").rows.length-1;

    var name = row.insertCell(0);
    var newText  = document.createTextNode(children);
    name.appendChild(newText);

    var exRow = row.insertCell(1);
    var ex = document.createElement("input");
    ex.className = "tableinput";
    ex.type = "number";
    ex.name = "ex_list[]";
    exRow.appendChild(ex);

    var perRow = row.insertCell(2);
    var per = document.createElement("input");
    per.className = "tableinput";
    per.type = "number";
    per.name = "period_list[]";
    perRow.appendChild(per);

    var arrRow = row.insertCell(3);
    var arr = document.createElement("input");
    arr.className = "tableinput";
    arr.type = "number";
    arr.name = "arr_list[]";
    arrRow.appendChild(arr);
} 


//reset form and task list count
document.getElementById("clearTasks").addEventListener("click", clearTasks)
function clearTasks(){
    var table = document.getElementById("inputTable").getElementsByTagName('tbody')[0];
    var rowCount = table.rows.length;
    for (var i = (rowCount-1); i > 3; i--) {
        table.deleteRow(i);
    }
    document.getElementById('taskForm').reset();
}

//disable right click 
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

//call python get inputs values, then run simulation
document.getElementById("sim").addEventListener("click", function(){
    eel.get_inputs()();    
});
eel.expose(sendInputs)
function sendInputs(){
    var algo = document.querySelector('input[name="Alogrithm"]:checked');
    if (typeof algo == 'undefined'){
        //TODO make own alert box
        alert("Please select a CPU Algorithm")
        return;
    }
    algo = algo.value;

    var ex_list = []
    var period_list = [] 
    var arr_list = [];
    document.getElementsByName('ex_list[]').forEach(function(e){
        ex_list.push(e.value)
    });
    document.getElementsByName('period_list[]').forEach(function(e){
        period_list.push(e.value)
    });
    document.getElementsByName('arr_list[]').forEach(function(e){
        arr_list.push(e.value)
    });
    var endTime = document.getElementById('endTime').value;

    return [ex_list, period_list, arr_list, algo, endTime]
}

function getDataset(index, data, deadline=false) { 

    colors = ["#0094d9", "#00a7e9", "#00b9ef", "#00caeb", "#00dadb", "#00e8c2", "#00f5a0", "#19ff78", "#5bff6a", "#7fff5c", "#9cff4e", "#b6ff41", "#cfff35", "#e6ff2b", "#fcff24"]; 
    color = colors[data[0].y];
    width = 30;
    name = 'Task ' + index;

    if (deadline){
        color = "#fff";
        width = 45;
        name = 'Task ' + index + ' deadline'
    }

    return { 
        label: name, 
        backgroundColor: color,
        borderColor: color,
        fill: false,
        borderWidth : width,
        data: data,
        pointRadius: 0,
        pointHoverRadius: 5
    }; 
}
    


//draw timeline graph
eel.expose(drawGraph);
var timeLineChart = null;

function drawGraph(tasks){
    var graph_values = []

    //destroy chart data
    if(timeLineChart!=null){
        timeLineChart.destroy();
    }

    //convert points to x & y data points grouped by lines
    tasks.forEach(function (task){
        task.forEach(function (block){
            var line = [];
            block.forEach(function (point){
                var x = point[1];
                var y = point[0];
            
                var json = {x: x, y: y};
                line.push(json);
            });
            graph_values.push(line);
        });
    });

    var ctx = document.getElementById('timeLine').getContext('2d');
    //generate timeline
    timeLineChart = new Chart(ctx, {
        type: 'line',
        data:  {
            datasets: []
        },
        options: {
            legend : {
                display : false
            },
            layout: {
                padding: {
                    top: 30,
                }
            },
            responsive : true,
            elements: { point: { hitRadius: 10, hoverRadius: 10, radius: 0 } },
            tooltips: {
                enabled: true /*,
                callbacks: {
                    label: function(tooltipItem, data) {
                      var datasetLabel = '';
                      return data.datasets[tooltipItem.datasetIndex].label
                    }
                }*/
           },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    gridLines: { color: "grey" },
                    ticks : {
                        beginAtzero :true,
                        stepSize : 1,
                        fontColor: "white"
                    }
                }],
                yAxes : [{
                    scaleLabel : {
                        display : false
                    },
                    ticks : {
                        beginAtZero :true,
                        max : tasks.length-1,
                        stepSize : 1,
                        fontColor: "white"
                    }
                }]
            }
        }
    });

    //update graph with values from simulation

    //graph_values.forEach(function (line, i) {
    for(var i = graph_values.length; i--;){
        line = graph_values[i];

        if (line[1].x % 1 != 0){
            timeLineChart.data.datasets.push(getDataset((line[0].y),line, true));
        }

        timeLineChart.data.datasets.push(getDataset((line[0].y),line));//JSON.parse(point))); 
    }
    timeLineChart.update();
}

//hide alert message
eel.expose(hide_alert);
function hide_alert(){
    document.getElementById("alert").style.display = "none";
}

eel.expose(show_alert);
function show_alert(msg){
    var alert = document.getElementById("alert");
    alert.innerHTML = msg;
    alert.style.display = "block";
}

//show utilization
eel.expose(show_util);
function show_util(msg){
    var alert = document.getElementById("util");
    alert.innerHTML = msg;
    alert.style.display = "block";
}
//hide util message
eel.expose(hide_util);
function hide_util(){
    document.getElementById("util").style.display = "none";
}

//show/hide loading
eel.expose(loading);
function loading(){
    var div = document.getElementsByClassName('lds-ring')[0];
    if (div.style.display == "inline-block"){
        div.style.display = "none";
    }
    else {
        div.style.display = "inline-block";
    }
}
