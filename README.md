# OS Task Scheduling Simulator
Simulate operating system scheduling algorithms with input task arrival and period then produce the execution timeline.

Algorithms Implemented:
* Rate monotonic
* Earliest deadline first

<br/>
<br/>

<p align="center">
  <img src="images/screen1.jpg" width="500" />
</p>

# Installation
* Install python 3
* clone/download repo
* ``` pip install -r requirements.txt ```
* ``` python processSim.py ```

# PyInstaller Packaging
``` python -m eel processSim.py web --onefile --windowed --icon=web\favicon.ico ```

<br/>
<br/>

# Libraries Used
* [Eel: Python library for HTML/JS GUI apps](https://github.com/samuelhwilliams/Eel)
* [ChartJS: HTML5 charts](https://github.com/chartjs/Chart.js)
