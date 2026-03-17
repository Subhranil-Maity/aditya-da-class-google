from flask import Flask, render_template, request, jsonify
import numpy as np
from scipy.optimize import fsolve
import json

app = Flask(__name__)

class EquationSolver:
    @staticmethod
    def solve_equation(expr, var, initial_guess=0):
        """Solve single variable equation"""
        try:
            def equation(x):
                return eval(expr, {var: x, 'sin': np.sin, 'cos': np.cos, 'tan': np.tan, 
                                  'sqrt': np.sqrt, 'exp': np.exp, 'log': np.log, 'pi': np.pi})
            
            solution = fsolve(equation, initial_guess)[0]
            return float(solution)
        except:
            return None
    
    @staticmethod
    def get_graph_data(expr, var, start=-10, end=10, points=1000):
        """Generate graph data for plotting"""
        try:
            x_vals = np.linspace(start, end, points)
            y_vals = []
            
            for x in x_vals:
                try:
                    y = eval(expr, {var: x, 'sin': np.sin, 'cos': np.cos, 'tan': np.tan, 
                                   'sqrt': np.sqrt, 'exp': np.exp, 'log': np.log, 'pi': np.pi})
                    y_vals.append(float(y) if np.isfinite(y) else None)
                except:
                    y_vals.append(None)
            
            return x_vals.tolist(), y_vals
        except:
            return None, None
    
    @staticmethod
    def get_3d_graph_data(expr, var1, var2, start=-5, end=5, points=50):
        """Generate 3D surface data for two variables"""
        try:
            x = np.linspace(start, end, points)
            y = np.linspace(start, end, points)
            X, Y = np.meshgrid(x, y)
            Z = np.zeros_like(X)
            
            for i in range(len(x)):
                for j in range(len(y)):
                    try:
                        z = eval(expr, {var1: X[j, i], var2: Y[j, i], 
                                       'sin': np.sin, 'cos': np.cos, 'sqrt': np.sqrt,
                                       'exp': np.exp, 'log': np.log, 'pi': np.pi})
                        Z[j, i] = float(z) if np.isfinite(z) else None
                    except:
                        Z[j, i] = None
            
            return {
                'x': x.tolist(),
                'y': y.tolist(),
                'z': Z.tolist(),
                'X': X.tolist(),
                'Y': Y.tolist()
            }
        except:
            return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    expression = data.get('expression', '')
    
    try:
        result = eval(expression, {
            'sin': np.sin, 'cos': np.cos, 'tan': np.tan,
            'sqrt': np.sqrt, 'exp': np.exp, 'log': np.log, 'log10': np.log10,
            'pi': np.pi, 'e': np.e
        })
        return jsonify({'result': float(result), 'error': None})
    except Exception as e:
        return jsonify({'result': None, 'error': str(e)})

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    expr = data.get('expression', '')
    var = data.get('variable', 'x')
    initial_guess = data.get('initial_guess', 0)
    
    solver = EquationSolver()
    solution = solver.solve_equation(expr, var, initial_guess)
    
    if solution is not None:
        return jsonify({'solution': solution, 'error': None})
    else:
        return jsonify({'solution': None, 'error': 'Could not solve equation'})

@app.route('/plot', methods=['POST'])
def plot():
    data = request.json
    expr = data.get('expression', '')
    var = data.get('variable', 'x')
    start = data.get('start', -10)
    end = data.get('end', 10)
    
    solver = EquationSolver()
    x_vals, y_vals = solver.get_graph_data(expr, var, start, end)
    
    if x_vals is not None:
        return jsonify({
            'x': x_vals,
            'y': y_vals,
            'error': None
        })
    else:
        return jsonify({'error': 'Could not generate plot'})

@app.route('/plot3d', methods=['POST'])
def plot3d():
    data = request.json
    expr = data.get('expression', '')
    var1 = data.get('variable1', 'x')
    var2 = data.get('variable2', 'y')
    start = data.get('start', -5)
    end = data.get('end', 5)
    
    solver = EquationSolver()
    graph_data = solver.get_3d_graph_data(expr, var1, var2, start, end)
    
    if graph_data is not None:
        return jsonify(graph_data)
    else:
        return jsonify({'error': 'Could not generate 3D plot'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
