// Mathematical operations object
const MathOps = {
    // Safe expression evaluator
    evaluate: function(expression) {
        try {
            // Replace display symbols with actual operators
            let expr = expression
                .replace(/÷/g, '/')
                .replace(/×/g, '*')
                .replace(/π/g, Math.PI.toString())
                .replace(/e/g, Math.E.toString());

            // Create a safe math context
            const context = {
                sin: Math.sin,
                cos: Math.cos,
                tan: Math.tan,
                sqrt: Math.sqrt,
                abs: Math.abs,
                log: Math.log10,
                ln: Math.log,
                exp: Math.exp,
                pi: Math.PI,
                e: Math.E,
                asin: Math.asin,
                acos: Math.acos,
                atan: Math.atan,
                sinh: Math.sinh,
                cosh: Math.cosh,
                tanh: Math.tanh
            };

            // Evaluate with limited scope
            const result = Function(...Object.keys(context), `return ${expr}`)(...Object.values(context));
            return result;
        } catch (error) {
            throw new Error('Invalid expression');
        }
    },

    // Solve single equation: f(x) = 0
    solveEquation: function(expr, variable = 'x', initialGuess = 1) {
        try {
            const f = (val) => {
                const context = {
                    [variable]: val,
                    x: val,
                    y: val,
                    z: val,
                    sin: Math.sin,
                    cos: Math.cos,
                    tan: Math.tan,
                    sqrt: Math.sqrt,
                    abs: Math.abs,
                    log: Math.log10,
                    ln: Math.log,
                    exp: Math.exp,
                    pi: Math.PI,
                    e: Math.E
                };

                try {
                    return Function(...Object.keys(context), `return ${expr}`)(...Object.values(context));
                } catch {
                    return NaN;
                }
            };

            // Newton-Raphson method
            let x = initialGuess;
            const tolerance = 1e-10;
            const maxIterations = 100;
            const h = 1e-5;

            for (let i = 0; i < maxIterations; i++) {
                const fx = f(x);
                const fpx = (f(x + h) - fx) / h;

                if (Math.abs(fpx) < 1e-10) break;

                const nextX = x - fx / fpx;
                if (Math.abs(nextX - x) < tolerance) {
                    return nextX;
                }
                x = nextX;
            }

            return x;
        } catch (error) {
            throw new Error('Could not solve equation');
        }
    },

    // Get graph data
    getGraphData: function(expr, variable = 'x', start = -10, end = 10, points = 500) {
        const xData = [];
        const yData = [];

        const step = (end - start) / points;

        for (let x = start; x <= end; x += step) {
            xData.push(x);
            try {
                const context = {
                    [variable]: x,
                    x: x,
                    y: x,
                    sin: Math.sin,
                    cos: Math.cos,
                    tan: Math.tan,
                    sqrt: Math.sqrt,
                    abs: Math.abs,
                    log: Math.log10,
                    ln: Math.log,
                    exp: Math.exp,
                    pi: Math.PI,
                    e: Math.E
                };

                const y = Function(...Object.keys(context), `return ${expr}`)(...Object.values(context));
                yData.push(isFinite(y) ? y : null);
            } catch {
                yData.push(null);
            }
        }

        return { xData, yData };
    },

    // Get 3D surface data
    get3DGraphData: function(expr, var1 = 'x', var2 = 'y', start = -5, end = 5, points = 30) {
        const xData = [];
        const yData = [];
        const zData = [];

        const step = (end - start) / points;

        for (let x = start; x <= end; x += step) {
            yData.push(x);
        }

        for (let y = start; y <= end; y += step) {
            xData.push(y);
        }

        for (let i = 0; i < xData.length; i++) {
            const zRow = [];
            for (let j = 0; j < yData.length; j++) {
                try {
                    const context = {
                        [var1]: xData[i],
                        [var2]: yData[j],
                        x: xData[i],
                        y: yData[j],
                        z: 0,
                        sin: Math.sin,
                        cos: Math.cos,
                        tan: Math.tan,
                        sqrt: Math.sqrt,
                        abs: Math.abs,
                        log: Math.log10,
                        ln: Math.log,
                        exp: Math.exp,
                        pi: Math.PI,
                        e: Math.E
                    };

                    const z = Function(...Object.keys(context), `return ${expr}`)(...Object.values(context));
                    zRow.push(isFinite(z) ? z : null);
                } catch {
                    zRow.push(null);
                }
            }
            zData.push(zRow);
        }

        return { xData, yData, zData };
    }
};

// Calculator State
let calcDisplay = '0';
let calcExpression = '';

// Calculator functions
function appendNumber(num) {
    if (calcDisplay === '0' && num !== '.') {
        calcDisplay = num.toString();
    } else {
        calcDisplay += num.toString();
    }
    updateDisplay();
}

function appendFunction(func) {
    if (func === 'pi') {
        calcDisplay += 'π';
    } else if (func === 'e') {
        calcDisplay += 'e';
    } else if (func === 'sqrt') {
        calcDisplay += 'sqrt(';
    } else if (func === 'exp') {
        calcDisplay += 'exp(';
    } else {
        calcDisplay += func + '(';
    }
    updateDisplay();
}

function clearDisplay() {
    calcDisplay = '0';
    calcExpression = '';
    updateDisplay();
}

function backspace() {
    calcDisplay = calcDisplay.slice(0, -1) || '0';
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('displayValue').textContent = calcDisplay;
}

function calculate() {
    try {
        const result = MathOps.evaluate(calcDisplay);
        calcExpression = calcDisplay;
        calcDisplay = result.toString();
        updateDisplay();
    } catch (error) {
        calcDisplay = 'Error';
        updateDisplay();
        setTimeout(() => {
            calcDisplay = '0';
            updateDisplay();
        }, 1500);
    }
}

// Graph functions
let chart2D = null;
let chart3D = null;

function plotGraph() {
    const expr = document.getElementById('graphExpr').value;
    const variable = document.getElementById('var1').value;
    const start = parseFloat(document.getElementById('graphStart').value);
    const end = parseFloat(document.getElementById('graphEnd').value);

    if (!expr) {
        alert('Please enter an expression');
        return;
    }

    try {
        const data = MathOps.getGraphData(expr, variable, start, end);
        
        // Destroy existing chart if any
        if (chart2D) {
            chart2D.destroy();
        }

        const ctx = document.getElementById('chartContainer');
        ctx.innerHTML = '<canvas id="canvas2d"></canvas>';

        chart2D = new Chart(document.getElementById('canvas2d'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: expr,
                    data: data.xData.map((x, i) => ({ x, y: data.yData[i] })),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    showLine: true,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#ffb3b3' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffb3b3' },
                        grid: { color: 'rgba(255, 107, 107, 0.1)' },
                        title: { display: true, text: variable, color: '#ffb3b3' }
                    },
                    y: {
                        ticks: { color: '#ffb3b3' },
                        grid: { color: 'rgba(255, 107, 107, 0.1)' },
                        title: { display: true, text: 'f(' + variable + ')', color: '#ffb3b3' }
                    }
                }
            }
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function plot3D() {
    const expr = document.getElementById('graphExpr').value;
    const var1 = document.getElementById('var1').value;
    const var2 = document.getElementById('var2').value;
    const start = parseFloat(document.getElementById('graphStart').value);
    const end = parseFloat(document.getElementById('graphEnd').value);

    if (!expr) {
        alert('Please enter an expression');
        return;
    }

    try {
        const data = MathOps.get3DGraphData(expr, var1, var2, start, end);

        const trace = {
            x: data.xData,
            y: data.yData,
            z: data.zData,
            type: 'surface',
            colorscale: [
                [0, '#0d0808'],
                [0.5, '#ff6b6b'],
                [1, '#ffb3b3']
            ],
            colorbar: {
                thickness: 20,
                len: 0.7,
                tickfont: { color: '#ffb3b3' }
            }
        };

        const layout = {
            title: expr,
            scene: {
                xaxis: {
                    title: var1,
                    backgroundcolor: '#1a0f0f',
                    gridcolor: 'rgba(255, 107, 107, 0.2)',
                    showbackground: true,
                    zerolinecolor: 'rgba(255, 107, 107, 0.5)'
                },
                yaxis: {
                    title: var2,
                    backgroundcolor: '#1a0f0f',
                    gridcolor: 'rgba(255, 107, 107, 0.2)',
                    showbackground: true,
                    zerolinecolor: 'rgba(255, 107, 107, 0.5)'
                },
                zaxis: {
                    backgroundcolor: '#1a0f0f',
                    gridcolor: 'rgba(255, 107, 107, 0.2)',
                    showbackground: true,
                    zerolinecolor: 'rgba(255, 107, 107, 0.5)'
                }
            },
            paper_bgcolor: '#1a0f0f',
            plot_bgcolor: '#0d0808',
            font: { color: '#ffb3b3' },
            margin: { l: 0, r: 0, t: 30, b: 0 }
        };

        const config = { responsive: true, displayModeBar: false };
        const container = document.getElementById('chart3dContainer');
        container.innerHTML = '<div id="plot3d"></div>';
        Plotly.newPlot('plot3d', [trace], layout, config);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Solver functions
function solveEquation() {
    const expr = document.getElementById('eqExpr').value;
    const variable = document.getElementById('eqVar').value;
    const guess = parseFloat(document.getElementById('eqGuess').value);

    if (!expr || !variable) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const solution = MathOps.solveEquation(expr, variable, guess);
        const resultBox = document.getElementById('solverResult');
        resultBox.className = 'result-box success';
        resultBox.innerHTML = `<strong>Solution:</strong><br>${variable} = ${solution.toFixed(6)}`;
    } catch (error) {
        const resultBox = document.getElementById('solverResult');
        resultBox.className = 'result-box error';
        resultBox.textContent = 'Error: ' + error.message;
    }
}

function solveSystem() {
    const eqsText = document.getElementById('systemEqs').value;
    const varsText = document.getElementById('sysVars').value;

    if (!eqsText || !varsText) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const equations = eqsText.split('\n').filter(e => e.trim());
        const variables = varsText.split(',').map(v => v.trim());

        if (equations.length !== variables.length) {
            throw new Error(`Number of equations (${equations.length}) must match variables (${variables.length})`);
        }

        if (equations.length > 3) {
            throw new Error('Maximum 3 equations supported');
        }

        // Initial guess
        const initialGuess = new Array(variables.length).fill(1);

        // Solve using numerical methods
        let solution = initialGuess.slice();

        for (let iter = 0; iter < 50; iter++) {
            const jacobian = [];
            const fValues = [];
            const h = 1e-5;

            // Calculate function values and jacobian
            for (let i = 0; i < equations.length; i++) {
                const context = {};
                for (let j = 0; j < variables.length; j++) {
                    context[variables[j]] = solution[j];
                }
                context.sin = Math.sin;
                context.cos = Math.cos;
                context.tan = Math.tan;
                context.sqrt = Math.sqrt;
                context.exp = Math.exp;
                context.log = Math.log;
                context.pi = Math.PI;
                context.abs = Math.abs;

                try {
                    fValues[i] = Function(...Object.keys(context), `return ${equations[i]}`)(...Object.values(context));
                } catch {
                    fValues[i] = 0;
                }

                jacobian[i] = [];
                for (let j = 0; j < variables.length; j++) {
                    const contextPlus = { ...context };
                    contextPlus[variables[j]] += h;

                    let fPlus;
                    try {
                        fPlus = Function(...Object.keys(contextPlus), `return ${equations[i]}`)(...Object.values(contextPlus));
                    } catch {
                        fPlus = fValues[i];
                    }

                    jacobian[i][j] = (fPlus - fValues[i]) / h;
                }
            }

            // Check convergence
            const residual = Math.sqrt(fValues.reduce((a, b) => a + b * b, 0));
            if (residual < 1e-10) {
                break;
            }

            // Simple fixed-point iteration for small systems
            for (let j = 0; j < variables.length && j < equations.length; j++) {
                solution[j] -= 0.1 * fValues[j] / (jacobian[j][j] || 1);
            }
        }

        const resultBox = document.getElementById('systemResult');
        resultBox.className = 'result-box success';
        let resultHTML = '<strong>System Solution:</strong><br>';
        for (let i = 0; i < variables.length; i++) {
            resultHTML += `${variables[i]} = ${solution[i].toFixed(6)}<br>`;
        }
        resultBox.innerHTML = resultHTML;
    } catch (error) {
        const resultBox = document.getElementById('systemResult');
        resultBox.className = 'result-box error';
        resultBox.textContent = 'Error: ' + error.message;
    }
}

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Initialize display
    updateDisplay();
});
