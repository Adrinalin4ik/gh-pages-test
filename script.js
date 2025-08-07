

// Console logging system
const consoleOutput = document.getElementById('consoleOutput');
const clearConsoleBtn = document.getElementById('clearConsoleBtn');

// Store original console methods
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    trace: console.trace,
    group: console.group,
    groupEnd: console.groupEnd,
    groupCollapsed: console.groupCollapsed,
    table: console.table,
    time: console.time,
    timeEnd: console.timeEnd,
    timeLog: console.timeLog,
    count: console.count,
    countReset: console.countReset,
    clear: console.clear
};

function logToConsole(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logElement = document.createElement('div');
    logElement.className = `console-log ${type}`;
    
    // Handle different types of messages (objects, arrays, etc.)
    let displayMessage = message;
    if (typeof message === 'object') {
        try {
            displayMessage = JSON.stringify(message, null, 2);
        } catch (e) {
            displayMessage = message.toString();
        }
    } else if (Array.isArray(message)) {
        displayMessage = JSON.stringify(message, null, 2);
    }
    
    logElement.innerHTML = `
        <span class="console-timestamp">[${timestamp}]</span>
        <span class="console-message">${displayMessage}</span>
    `;
    consoleOutput.appendChild(logElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Override console methods to redirect to HTML console
function overrideConsole() {
    console.log = (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logToConsole(message, 'info');
        originalConsole.log(...args);
    };

    console.error = (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logToConsole(message, 'error');
        originalConsole.error(...args);
    };

    console.warn = (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logToConsole(message, 'warning');
        originalConsole.warn(...args);
    };

    console.info = (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logToConsole(message, 'info');
        originalConsole.info(...args);
    };

    console.debug = (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logToConsole(message, 'debug');
        originalConsole.debug(...args);
    };

    console.trace = (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logToConsole(message + '\n' + new Error().stack, 'debug');
        originalConsole.trace(...args);
    };

    console.table = (data) => {
        try {
            const tableMessage = typeof data === 'object' ? 
                JSON.stringify(data, null, 2) : String(data);
            logToConsole('Table: ' + tableMessage, 'info');
        } catch (e) {
            logToConsole('Table data (could not stringify)', 'info');
        }
        originalConsole.table(data);
    };

    console.time = (label) => {
        logToConsole(`Timer started: ${label}`, 'debug');
        originalConsole.time(label);
    };

    console.timeEnd = (label) => {
        logToConsole(`Timer ended: ${label}`, 'debug');
        originalConsole.timeEnd(label);
    };

    console.count = (label) => {
        logToConsole(`Count: ${label}`, 'debug');
        originalConsole.count(label);
    };

    console.group = (label) => {
        logToConsole(`Group: ${label}`, 'debug');
        originalConsole.group(label);
    };

    console.groupEnd = () => {
        logToConsole('Group End', 'debug');
        originalConsole.groupEnd();
    };

    console.groupCollapsed = (label) => {
        logToConsole(`Group Collapsed: ${label}`, 'debug');
        originalConsole.groupCollapsed(label);
    };

    console.clear = () => {
        consoleOutput.innerHTML = '';
        logToConsole('Console cleared', 'info');
        originalConsole.clear();
    };
}

// Clear console functionality
clearConsoleBtn.addEventListener('click', () => {
    consoleOutput.innerHTML = '';
    logToConsole('Console cleared', 'info');
});

// Initialize console override
overrideConsole();

// DOM elements
const counterElement = document.getElementById('counter');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const ctaButton = document.getElementById('ctaButton');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

// Counter functionality
let counter = 0;

function updateCounter() {
    counterElement.textContent = counter;
    logToConsole(`Counter updated to: ${counter}`, 'info');
}

incrementBtn.addEventListener('click', () => {
    counter++;
    updateCounter();
    animateButton(incrementBtn);
    console.log(`Counter incremented to: ${counter}`);
    console.info('User interaction: Increment button clicked');
});

decrementBtn.addEventListener('click', () => {
    counter--;
    updateCounter();
    animateButton(decrementBtn);
    console.warn(`Counter decremented to: ${counter}`);
    console.info('User interaction: Decrement button clicked');
});

resetBtn.addEventListener('click', () => {
    counter = 0;
    updateCounter();
    animateButton(resetBtn);
    console.log('Counter reset to 0');
    console.info('User interaction: Reset button clicked');
});

// Todo list functionality
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    logToConsole(`Todos saved to localStorage (${todos.length} items)`, 'debug');
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div>
                <button class="btn" onclick="toggleTodo(${index})">${todo.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
    logToConsole(`Rendered ${todos.length} todo items`, 'debug');
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        saveTodos();
        renderTodos();
        animateButton(addTodoBtn);
        console.log(`Todo added: "${text}"`);
        console.info('User interaction: Todo added');
    } else {
        console.warn('Attempted to add empty todo');
    }
}

function toggleTodo(index) {
    const todo = todos[index];
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
    console.log(`Todo "${todo.text}" ${todo.completed ? 'completed' : 'uncompleted'}`);
    console.info('User interaction: Todo toggled');
}

function deleteTodo(index) {
    const deletedTodo = todos[index];
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
    console.warn(`Todo deleted: "${deletedTodo.text}"`);
    console.info('User interaction: Todo deleted');
}

addTodoBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// CTA button functionality
ctaButton.addEventListener('click', () => {
    animateButton(ctaButton);
    showNotification('Thanks for getting started! 🚀');
    console.log('CTA button clicked - Get Started');
    console.info('User interaction: Get Started button clicked');
});

// Utility functions
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    logToConsole(`Button animated: ${button.textContent || button.id}`, 'debug');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    logToConsole(`Notification shown: "${message}"`, 'info');
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
            logToConsole('Notification removed', 'debug');
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dummy App initialized');
    console.info('Application loaded successfully');
    console.debug('Debug mode enabled');
    
    // Demonstrate different console methods
    console.warn('This is a warning message');
    console.error('This is an error message (for demonstration)');
    
    // Demonstrate object logging
    const appInfo = {
        name: 'Dummy App',
        version: '1.0.0',
        features: ['Counter', 'Todo List', 'Console Logging']
    };
    console.log('App Info:', appInfo);
    
    // Demonstrate array logging
    console.log('Available features:', ['Counter', 'Todo List', 'Console Logging']);
    
    // Demonstrate table logging
    const todoStats = [
        { type: 'Completed', count: 0 },
        { type: 'Pending', count: 3 }
    ];
    console.table(todoStats);
    
    // Demonstrate timing
    console.time('app-initialization');
    
    updateCounter();
    renderTodos();
    
    // Add some initial todos for demo
    if (todos.length === 0) {
        todos = [
            { text: 'Welcome to the demo app!', completed: false },
            { text: 'Try adding your own tasks', completed: false },
            { text: 'Click "Complete" to mark tasks done', completed: false }
        ];
        saveTodos();
        renderTodos();
    }
    
    console.timeEnd('app-initialization');
    console.log('✅ App initialization complete');

    setTimeout(() => {
      consoleOutput.innerHTML = '';
      logToConsole('Console cleared', 'info');
      try {
        chrome.power.requestKeepAwake("display");
      } catch(ex) {
        console.error(ex.message)
      }
      
    }, 1000)
});

// Add some fun interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('feature-card')) {
        e.target.style.transform = 'scale(1.05)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 200);
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        console.log('🎉 Easter egg activated! Konami code detected!');
        console.info('Easter egg: Background color changed');
        showNotification('🎉 You found the easter egg! 🎉');
        document.body.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)';
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            console.log('Easter egg: Background color restored');
        }, 3000);
        konamiCode = [];
    }
});
