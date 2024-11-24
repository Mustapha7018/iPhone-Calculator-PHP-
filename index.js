class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentNumber = document.getElementById('currentNumber');
        this.lastResult = document.getElementById('lastResult');
        this.pendingOperator = document.getElementById('pendingOperator');
        this.newNumber = true;
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                switch(action) {
                    case 'number':
                        this.handleNumber(e.target.value);
                        break;
                    case 'operator':
                        this.handleOperator(e.target.dataset.operator);
                        break;
                    case 'decimal':
                        this.handleDecimal();
                        break;
                    case 'clear':
                        this.handleClear();
                        break;
                    case 'negate':
                        this.handleNegate();
                        break;
                    case 'percent':
                        this.handlePercent();
                        break;
                    case 'equals':
                        this.handleEquals();
                        break;
                }
            });
        });
    }

    handleNumber(num) {
        if (this.newNumber) {
            this.display.value = num;
            this.newNumber = false;
        } else {
            if (this.display.value === '0') {
                this.display.value = num;
            } else {
                if (this.display.value.length < 9) { // Prevent overflow
                    this.display.value += num;
                }
            }
        }
        this.currentNumber.value = this.display.value;
    }

    handleOperator(operator) {
        const currentValue = parseFloat(this.display.value);
        
        if (this.lastResult.value && this.pendingOperator.value) {
            this.calculateResult();
        }
        
        this.lastResult.value = currentValue;
        this.pendingOperator.value = operator;
        this.newNumber = true;
    }

    calculateResult() {
        const current = parseFloat(this.display.value);
        const previous = parseFloat(this.lastResult.value);
        let result;

        switch(this.pendingOperator.value) {
            case '+':
                result = previous + current;
                break;
            case '-':
                result = previous - current;
                break;
            case '*':
                result = previous * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = previous / current;
                }
                break;
        }

        if (result === 'Error') {
            this.display.value = result;
        } else {
            // Format result to prevent overflow
            result = parseFloat(result.toFixed(8));
            if (result.toString().length > 9) {
                result = result.toExponential(4);
            }
            this.display.value = result;
        }
        
        this.lastResult.value = result;
        this.newNumber = true;
    }

    handleDecimal() {
        if (this.newNumber) {
            this.display.value = '0.';
            this.newNumber = false;
        } else if (!this.display.value.includes('.')) {
            this.display.value += '.';
        }
        this.currentNumber.value = this.display.value;
    }

    handleClear() {
        this.display.value = '0';
        this.currentNumber.value = '';
        this.lastResult.value = '';
        this.pendingOperator.value = '';
        this.newNumber = true;
    }

    handleNegate() {
        this.display.value = (-parseFloat(this.display.value)).toString();
        this.currentNumber.value = this.display.value;
    }

    handlePercent() {
        this.display.value = (parseFloat(this.display.value) / 100).toString();
        this.currentNumber.value = this.display.value;
    }

    handleEquals() {
        if (this.lastResult.value && this.pendingOperator.value) {
            this.calculateResult();
            this.pendingOperator.value = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});