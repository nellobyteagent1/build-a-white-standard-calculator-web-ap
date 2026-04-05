(() => {
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const buttons = document.querySelectorAll('.btn');

  let current = '0';
  let previous = '';
  let operator = '';
  let shouldReset = false;

  function updateDisplay() {
    resultEl.textContent = current;
    resultEl.classList.toggle('small', current.length > 10);

    if (operator && previous) {
      expressionEl.textContent = `${previous} ${operator}`;
    } else {
      expressionEl.textContent = '';
    }
  }

  function formatResult(num) {
    if (!isFinite(num)) return 'Error';
    const str = String(num);
    if (str.length <= 12) return str;
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }
    return parseFloat(num.toPrecision(10)).toString();
  }

  function calculate(a, op, b) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '×': return x * y;
      case '÷': return y === 0 ? Infinity : x / y;
      default: return y;
    }
  }

  function clearHighlight() {
    document.querySelectorAll('.btn.op').forEach(b => b.classList.remove('active'));
  }

  function highlightOp(opSymbol) {
    clearHighlight();
    document.querySelectorAll('.btn.op').forEach(b => {
      if (b.dataset.value === opSymbol) b.classList.add('active');
    });
  }

  function handleNumber(value) {
    clearHighlight();
    if (shouldReset) {
      current = value;
      shouldReset = false;
    } else if (current === '0' && value !== '.') {
      current = value;
    } else {
      if (current.length >= 15) return;
      current += value;
    }
  }

  function handleDecimal() {
    clearHighlight();
    if (shouldReset) {
      current = '0.';
      shouldReset = false;
      return;
    }
    if (!current.includes('.')) {
      current += '.';
    }
  }

  function handleOperator(op) {
    if (operator && !shouldReset) {
      const result = calculate(previous, operator, current);
      current = formatResult(result);
      previous = current;
    } else {
      previous = current;
    }
    operator = op;
    shouldReset = true;
    highlightOp(op);
  }

  function handleEquals() {
    clearHighlight();
    if (!operator || !previous) return;
    const result = calculate(previous, operator, current);
    const expr = `${previous} ${operator} ${current} =`;
    current = formatResult(result);
    expressionEl.textContent = expr;
    previous = '';
    operator = '';
    shouldReset = true;
    resultEl.textContent = current;
    resultEl.classList.toggle('small', current.length > 10);
    return;
  }

  function handleClear() {
    clearHighlight();
    current = '0';
    previous = '';
    operator = '';
    shouldReset = false;
  }

  function handleDelete() {
    clearHighlight();
    if (shouldReset) return;
    current = current.length > 1 ? current.slice(0, -1) : '0';
  }

  function handlePercent() {
    clearHighlight();
    const val = parseFloat(current);
    if (isNaN(val)) return;
    current = formatResult(val / 100);
    shouldReset = true;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      switch (action) {
        case 'number':
          handleNumber(btn.dataset.value);
          break;
        case 'decimal':
          handleDecimal();
          break;
        case 'operator':
          handleOperator(btn.dataset.value);
          break;
        case 'equals':
          handleEquals();
          return;
        case 'clear':
          handleClear();
          break;
        case 'delete':
          handleDelete();
          break;
        case 'percent':
          handlePercent();
          break;
      }

      updateDisplay();
    });
  });

  // Keyboard support
  document.addEventListener('keydown', e => {
    const key = e.key;
    if (key >= '0' && key <= '9') { handleNumber(key); }
    else if (key === '.') { handleDecimal(); }
    else if (key === '+') { handleOperator('+'); }
    else if (key === '-') { handleOperator('-'); }
    else if (key === '*') { handleOperator('×'); }
    else if (key === '/') { e.preventDefault(); handleOperator('÷'); }
    else if (key === '%') { handlePercent(); }
    else if (key === 'Enter' || key === '=') { handleEquals(); return; }
    else if (key === 'Backspace') { handleDelete(); }
    else if (key === 'Escape' || key === 'c' || key === 'C') { handleClear(); }
    else { return; }
    updateDisplay();
  });

  updateDisplay();
})();
