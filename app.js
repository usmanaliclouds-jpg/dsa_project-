// --- Global Setup ---
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
const logPanel = document.getElementById('log-panel');

// Set canvas dimensions dynamically
canvas.width = 1000; 
canvas.height = 500;

let head = null;
const NODE_WIDTH = 60;
const NODE_HEIGHT = 40;
const NODE_SPACING = 80;

// --- 1. Data Structure Class (Node) ---
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.x = 0; // x-coordinate for drawing
        this.y = canvas.height / 2; // y-coordinate for drawing
    }
}

// --- 2. Linked List Operations ---

function insertAtHead() {
    const inputElement = document.getElementById('value-input');
    const value = parseInt(inputElement.value);

    if (isNaN(value) || value < 1) {
        logAction("Please enter a valid number.", 'error');
        return;
    }

    logAction(`Inserting value: ${value} at head.`);
    
    const newNode = new Node(value);
    
    // 1. Link new node to the old head
    newNode.next = head;
    
    // 2. Update head
    head = newNode;
    
    // Redraw the structure
    drawList();
    
    // Clear input after use
    inputElement.value = '';
}

function clearList() {
    head = null;
    logAction("List cleared.", 'warning');
    drawList();
}

// --- 3. Visualization and Animation (Canvas API) ---

function drawNode(node, x, y, color = '#2196F3') {
    // Draw the box (node)
    ctx.fillStyle = color;
    ctx.fillRect(x, y, NODE_WIDTH, NODE_HEIGHT);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x, y, NODE_WIDTH, NODE_HEIGHT);

    // Draw the data
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.data, x + NODE_WIDTH / 2, y + NODE_HEIGHT / 2);

    // Update node position for next drawing cycle
    node.x = x;
    node.y = y;
}

function drawArrow(x1, y1, x2, y2) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw arrowhead (simple triangle)
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = 8;
    ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function drawList() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let current = head;
    let xPos = 50;
    const yPos = canvas.height / 2 - NODE_HEIGHT / 2;
    
    if (!current) {
        ctx.fillStyle = '#999';
        ctx.fillText("List is Empty. Insert a value.", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Loop through and draw each node
    while (current) {
        drawNode(current, xPos, yPos);

        // Draw arrow to the next node if it exists
        if (current.next) {
            const startX = xPos + NODE_WIDTH;
            const endX = xPos + NODE_WIDTH + NODE_SPACING;
            drawArrow(startX, yPos + NODE_HEIGHT / 2, endX, yPos + NODE_HEIGHT / 2);
        }
        
        // Move to the next node and update x position
        current = current.next;
        xPos += NODE_WIDTH + NODE_SPACING;
    }
}

// --- 4. Log Panel [cite: 50] ---
function logAction(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    let color = '';
    
    if (type === 'error') color = 'red';
    else if (type === 'warning') color = 'orange';
    else color = 'green';
    
    logPanel.innerHTML = `<div style="color: ${color};">
                            [${time}] ${message}
                          </div>` + logPanel.innerHTML;
    
    // Keep the panel scrolled to the top
    logPanel.scrollTop = 0; 
}

// Initial draw call
drawList();
logAction("Visualizer ready. Use the controls to start.", 'info');
