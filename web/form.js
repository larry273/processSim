
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

    return [ex_list, period_list, arr_list, algo]
}

//draw timeline graph
eel.expose(drawGraph);
function drawGraph(tasks){
    var ctx = document.getElementById('timeLine').getContext('2d');
    //generate timeline
    var timeLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
            {

                label: 'Scatter Dataset',
                backgroundColor: "rgba(246,156,85,1)",
                borderColor: "rgba(246,156,85,1)",
                fill: false,
                borderWidth : 15,
                pointRadius : 0,
                data: [
                    {
                        x: 0,
                        y: 9
                    }, {
                        x: 3,
                        y: 9
                    }
                ]
            },
            {
                backgroundColor: "rgba(208,255,154,1)",
                borderColor: "rgba(208,255,154,1)",
                fill: false,
                borderWidth : 15,
                pointRadius : 0,
                data: [
                    {
                        x: 3,
                        y: 7
                    }, {
                        x: 5,
                        y: 7
                    }
                ]
            },
            {

                label: 'Scatter Dataset',
                backgroundColor: "rgba(246,156,85,1)",
                borderColor: "rgba(246,156,85,1)",
                fill: false,
                borderWidth : 15,
                pointRadius : 0,
                data: [
                    {
                        x: 5,
                        y: 5
                    }, {
                        x: 10,
                        y: 5
                    }
                ]
            },
            {
                backgroundColor: "rgba(208,255,154,1)",
                borderColor: "rgba(208,255,154,1)",
                fill: false,
                borderWidth : 15,
                pointRadius : 0,
                data: [
                    {
                        x: 10,
                        y: 3
                    }, {
                        x: 13,
                        y: 3
                    }
                ]
            }
            ]
        },
        options: {
            legend : {
                display : false
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks : {
                        beginAtzero :true,
                        stepSize : 1
                    }
                }],
                yAxes : [{
                    scaleLabel : {
                        display : false
                    },
                    ticks : {
                        beginAtZero :true,
                        max : 10
                    }
                }]
            }
        }
    });
}

