Step 1: Installing & Running Flask
- First run the front-end server
**IMPORTANT**
    - change proxy in package.json
    - ```"proxy": "http://localhost:5000",```
    - add above line before "dependencies"
    - delete package-lock.json, and re-install dependencies with npm install.
- Now cd into this server directory
```source env/bin/activate``` (MAY BE OPTIONAL)
```pip install flask```
```export FLASK_APP=webML```
```flask run```
Output should look like:
Output
 * Serving Flask app "hello" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 813-894-335

Server is now listening on PORT 5000

Description of Files:
- webML.py: main flask server code.
- model-v2.h5: serialized model. Makes it faster to predict w/o creating whole new model again.
