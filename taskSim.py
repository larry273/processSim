import collections
import sys
import eel

MAX_EXECUTION = 100

class Task:
    def __init__(self, name, brst, prd, arvl):
        self.name = name
        self.brst = brst
        self.prd = prd
        self.arvl = arvl
        self.deadline = arvl + prd

        self.remaining = brst
        self.priority = 0
        self.execution_times = []

#sort given tasks by period
def sort_by_period(tasks, time):
    new_tasks = []
    remaining_tasks = []

    for task in tasks:
        if task.arvl <= time:
            new_tasks.append(task)
        else:
            remaining_tasks.append(task)

    new_tasks.sort(key=lambda x: x.prd)
    for i, task in enumerate(new_tasks):
        task.priority = i
    return collections.deque(new_tasks), remaining_tasks

#sort given tasks by deadline
def sort_by_deadline(tasks, time):
    new_tasks = []
    remaining_tasks = []

    for task in tasks:
        if task.arvl <= time:
            new_tasks.append(task)
        else:
            remaining_tasks.append(task)

    new_tasks.sort(key=lambda x: x.deadline)
    for i, task in enumerate(new_tasks):
        task.priority = i
    return collections.deque(new_tasks), remaining_tasks


#exection times for chart.js must be in point format [x:10, y:20]
#execution time saved as [[x1,y1],[x2,y1]] added to overall list

#find rate monotonic execution times for input task list
def rm_schedule(tasks, start, stop):
    print(f"Execute to {start}-{stop}")

    #assign priorities based on 0 arrivals
    task_q, not_arrived = sort_by_period(tasks, 0)

    executing = None
    priority = 0
    start_t = 0
    task_executions = [] #list for all task execution times
    fail = None

    #start execute in order of priority 
    for i in range(start, stop+1):
        print(f"Current Time: {i}")

        #check for new arrivals
        for t in not_arrived:
            if t.arvl == i:
                task_q, not_arrived = sort_by_period(list(task_q) + not_arrived, i)

        if executing:
            for t in task_q:
                #check for stop conditions, new task higher priority or failed deadlines
                if t.priority < executing.priority:
                    #find new index of executing task
                    for index, task in enumerate(task_q):
                        if task.name == executing.name:
                            #task_q[index].execution_times.append([start_t, i])
                            task_q[index].execution_times.append([[task_q[index].name, start_t], [task_q[index].name, i]])

                            task_q[index].remaining -= (i - start_t)
                            print(f"*** Stopping Task {task_q[index].name}")
                    
                    #start higher priority task
                    start_t = i
                    executing = task_q[priority]
                    print(f"*** Executing Task {task_q[priority].name}")

                elif t.deadline < i:
                    print(f"Failed to meet deadline for {t.name}")
                    fail = f"Task {t.name} missed deadline at {i}"
                    #exit loop on missed deadline
                    break

            #check end of execution
            if task_q[priority].remaining + start_t == i:
                #on completion, remove task from task_q, add to not_arrived, set exec time and new deadline
                #task_q[priority].execution_times.append([start_t, i])
                task_q[priority].execution_times.append([[task_q[priority].name, start_t], [task_q[priority].name, i]])
                task_q[priority].arvl = task_q[priority].deadline
                task_q[priority].deadline += task_q[priority].prd
                task_q[priority].remaining = task_q[priority].brst
                
                print(f"*** Completed Task {task_q[priority].name}")

                if i == stop:
                    print("Completed timeline")
                    break

                not_arrived.append(task_q[priority])
                task_q.popleft()
                
                start_t = i
                try:
                    executing = task_q[priority]
                except IndexError:
                    print("*** No task to execute")
                    executing = None
                    continue

                print(f"*** Executing Task {task_q[priority].name}")

            elif task_q[priority].deadline <= i:
                print(f"Failed to meet deadline for {task_q[priority].name}")
                fail = f"Task {task_q[priority].name} missed deadline at {i}"
                #exit loop on missed deadline
                break

        else:
            try:
                executing = task_q[priority]
            except IndexError:
                print("*** No task to execute")
                executing = None
                continue
            
            print(f"*** Executing Task {task_q[priority].name}")
            start_t = i


    #when done compile execution times
    for i in range(len(not_arrived)):
        task_executions.append(not_arrived[i].execution_times)
    for i in range(len(task_q)):
        task_executions.append(task_q[i].execution_times)

    return task_executions, fail 
    #for each time value
        #check for new arrival, reassign priorites
        #stop execution on higher priority or complete
        #check if task missed deadline, stop timeline calc

#find edf executions times for input task list
def edf_schedule(tasks, start, stop):
    #assign priorities based on 0 arrivals
    task_q, not_arrived = sort_by_deadline(tasks, 0)

    executing = None
    priority = 0
    start_t = 0
    task_executions = [] #list for all task execution times
    fail = None


    for i in range(start, stop+1):
        print(f"Current Time: {i}")

        #check for new arrivals
        for t in not_arrived:
            if t.arvl == i:
                task_q, not_arrived = sort_by_deadline(list(task_q) + not_arrived, i)

        if executing:
            for t in task_q:
                #check for stop conditions, new task higher priority or failed deadlines
                if t.deadline < executing.deadline:
                    #find new index of executing task
                    for index, task in enumerate(task_q):
                        if task.name == executing.name:
                            #task_q[index].execution_times.append([start_t, i])
                            task_q[index].execution_times.append([[task_q[index].name, start_t], [task_q[index].name, i]])

                            task_q[index].remaining -= (i - start_t)
                            print(f"*** Stopping Task {task_q[index].name}")
                    
                    #start higher priority task
                    start_t = i
                    executing = task_q[priority]
                    print(f"*** Executing Task {task_q[priority].name}")

                elif t.deadline < i:
                    print(f"Failed to meet deadline for {t.name}")
                    fail = f"Task {t.name} missed deadline at {i}"
                    #exit loop on missed deadline
                    break

            #check end of execution
            if task_q[priority].remaining + start_t == i:
                task_q[priority].execution_times.append([[task_q[priority].name, start_t], [task_q[priority].name, i]])
                task_q[priority].arvl = task_q[priority].deadline
                task_q[priority].deadline += task_q[priority].prd
                task_q[priority].remaining = task_q[priority].brst
                
                print(f"*** Completed Task {task_q[priority].name}")

                if i == stop:
                    print("Completed timeline")
                    break

                not_arrived.append(task_q[priority])
                task_q.popleft()
                
                start_t = i
                try:
                    executing = task_q[priority]
                except IndexError:
                    print("*** No task to execute")
                    executing = None
                    continue

                print(f"*** Executing Task {task_q[priority].name}")

            elif task_q[priority].deadline <= i:
                print(f"Failed to meet deadline for {task_q[priority].name}")
                fail = f"Task {task_q[priority].name} missed deadline at {i}"
                #exit loop on missed deadline
                break

        else:
            try:
                executing = task_q[priority]
            except IndexError:
                print("*** No task to execute")
                executing = None
                continue
            
            print(f"*** Executing Task {task_q[priority].name}")
            start_t = i


    #when done compile execution times
    for i in range(len(not_arrived)):
        task_executions.append(not_arrived[i].execution_times)
    for i in range(len(task_q)):
        task_executions.append(task_q[i].execution_times)

    return task_executions, fail 


@eel.expose
def get_inputs():
    eel.hide_alert()
    in_values = eel.sendInputs()()
    if not in_values:
        return

    print(f"Input values: {in_values}")
    algo = in_values[3]
    parsed_values = [in_values[0], in_values[1], in_values[2]]
    #TODO handle blank rows in python, convert to int, handle bad entries (regex)
    #TODO alert js on missing values
    parsed_values = check_inputs(parsed_values)

    tasks = []
    for i in range(len(parsed_values[0])):
        tasks.append(Task(i+1, parsed_values[0][i], parsed_values[1][i], parsed_values[2][i]))
    
    #calculate task execution times
    if algo == 'rm':
        print("Performing rm scheduling")
        ex_times, result = rm_schedule(tasks, 0, MAX_EXECUTION)
        
        if result:
            eel.show_alert(result)

        print("Completed RM scheduling")
        eel.drawGraph(ex_times)

    elif algo == 'edf':
        print("performing edf scheduling")
        ex_times, result = edf_schedule(tasks, 0, MAX_EXECUTION)

        if result:
            eel.show_alert(result)

        print("Completed EDF scheduling")
        eel.drawGraph(ex_times)

    

#remove blank rows, and convert to integers
#execution time must, period must, arrival can be blank
def check_inputs(tasks):
    print("test")
    filtered_tasks = []
    for t in tasks:
        t = list(filter(None, t))
        filtered_tasks.append(t)

    int_tasks = [[int(x) for x in t] for t in filtered_tasks]
    return int_tasks


if __name__ == "__main__":
    tasks = []  

    #RM Example 1, Lecture Notes
    #tasks.append(Task(1, 5, 25, 0))
    #tasks.append(Task(3, 20, 60, 0))
    #tasks.append(Task(2, 8, 35, 0))
    #tasks.append(Task(4, 15, 105, 0))

    #rm_schedule(tasks, 0, MAX_EXECUTION)
    eel.init('web')
    eel.start('form.html')


