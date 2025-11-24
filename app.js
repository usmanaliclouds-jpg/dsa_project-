// JavaScript-based Data Structures (will be replaced with WASM in production)
// For now, this provides full functionality without requiring compilation

class BinaryHeap {
    constructor(isMinHeap = true) {
        this.heap = [];
        this.isMinHeap = isMinHeap;
        this.operations = [];
    }

    insert(value) {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
        this.operations.push(`Inserted ${value} → Heapified up`);
    }

    extractRoot() {
        if (this.heap.length === 0) return null;
        const root = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapifyDown(0);
        }
        this.operations.push(`Extracted ${root} → Heapified down`);
        return root;
    }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if ((this.isMinHeap && this.heap[parentIndex] > this.heap[index]) ||
                (!this.isMinHeap && this.heap[parentIndex] < this.heap[index])) {
                [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
                index = parentIndex;
            } else break;
        }
    }

    heapifyDown(index) {
        while (2 * index + 1 < this.heap.length) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if ((this.isMinHeap && this.heap[left] < this.heap[smallest]) ||
                (!this.isMinHeap && this.heap[left] > this.heap[smallest])) {
                smallest = left;
            }

            if (right < this.heap.length &&
                ((this.isMinHeap && this.heap[right] < this.heap[smallest]) ||
                 (!this.isMinHeap && this.heap[right] > this.heap[smallest]))) {
                smallest = right;
            }

            if (smallest !== index) {
                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            } else break;
        }
    }

    getArray() {
        return [...this.heap];
    }

    clear() {
        this.heap = [];
        this.operations = [];
    }
}

class AVLNode {
    constructor(value) {
        this.value = value;
        this.height = 1;
        this.left = null;
        this.right = null;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.operations = [];
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
        x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
        this.operations.push(`RR Rotation on node ${y.value}`);
        return x;
    }

    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
        this.operations.push(`LL Rotation on node ${x.value}`);
        return y;
    }

    insert(value) {
        this.root = this._insertHelper(this.root, value);
        this.operations.push(`Inserted ${value}`);
    }

    _insertHelper(node, value) {
        if (!node) return new AVLNode(value);

        if (value < node.value) {
            node.left = this._insertHelper(node.left, value);
        } else if (value > node.value) {
            node.right = this._insertHelper(node.right, value);
        } else {
            return node;
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalance(node);

        // LL
        if (balance > 1 && value < node.left.value) return this.rotateRight(node);
        // RR
        if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
        // LR
        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        // RL
        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    delete(value) {
        this.root = this._deleteHelper(this.root, value);
        this.operations.push(`Deleted ${value}`);
    }

    _deleteHelper(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._deleteHelper(node.left, value);
        } else if (value > node.value) {
            node.right = this._deleteHelper(node.right, value);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            let minRight = node.right;
            while (minRight.left) minRight = minRight.left;
            node.value = minRight.value;
            node.right = this._deleteHelper(node.right, minRight.value);
        }

        if (!node) return null;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0) return this.rotateRight(node);
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        if (balance < -1 && this.getBalance(node.right) <= 0) return this.rotateLeft(node);
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    inorder(node = this.root, result = []) {
        if (!node) return result;
        this.inorder(node.left, result);
        result.push(node.value);
        this.inorder(node.right, result);
        return result;
    }

    getHeight() {
        return this.getHeight(this.root);
    }

    clear() {
        this.root = null;
        this.operations = [];
    }

    getTreeNodes(node = this.root, result = []) {
        if (!node) return result;
        result.push({
            value: node.value,
            height: node.height,
            balance: this.getBalance(node)
        });
        if (node.left) this.getTreeNodes(node.left, result);
        if (node.right) this.getTreeNodes(node.right, result);
        return result;
    }
}

class HashTable {
    constructor(size = 13) {
        this.size = size;
        this.table = Array(size).fill(null).map(() => []);
        this.operations = [];
    }

    hash(key) {
        return ((key % this.size) + this.size) % this.size;
    }

    insert(key, value) {
        const index = this.hash(key);
        const bucket = this.table[index];
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value;
                this.operations.push(`Updated key ${key} in bucket ${index}`);
                return;
            }
        }
        bucket.push([key, value]);
        this.operations.push(`Inserted (${key}:${value}) in bucket ${index}`);
    }

    search(key) {
        const index = this.hash(key);
        for (let [k, v] of this.table[index]) {
            if (k === key) {
                this.operations.push(`Found ${key} in bucket ${index}`);
                return v;
            }
        }
        this.operations.push(`Key ${key} not found`);
        return null;
    }

    remove(key) {
        const index = this.hash(key);
        this.table[index] = this.table[index].filter(([k]) => k !== key);
        this.operations.push(`Removed key ${key}`);
    }

    getState() {
        return this.table.map((bucket, idx) => ({
            bucket: idx,
            entries: bucket
        })).filter(b => b.entries.length > 0);
    }

    clear() {
        this.table = Array(this.size).fill(null).map(() => []);
        this.operations = [];
    }
}

class Graph {
    constructor(vertices) {
        this.vertices = vertices;
        this.adjList = Array(vertices).fill(null).map(() => []);
        this.edges = [];
        this.operations = [];
    }

    addEdge(u, v) {
        if (u >= 0 && u < this.vertices && v >= 0 && v < this.vertices) {
            this.adjList[u].push(v);
            this.adjList[v].push(u);
            this.edges.push([u, v]);
            this.operations.push(`Edge added: ${u} ↔ ${v}`);
        }
    }

    bfs(start) {
        const visited = Array(this.vertices).fill(false);
        const result = [];
        const queue = [start];
        visited[start] = true;

        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node);
            this.operations.push(`Visited node ${node}`);

            for (let neighbor of this.adjList[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                    this.operations.push(`Queued node ${neighbor}`);
                }
            }
        }

        return result;
    }

    dfs(start) {
        const visited = Array(this.vertices).fill(false);
        const result = [];
        const stack = [start];
        visited[start] = true;

        while (stack.length > 0) {
            const node = stack.pop();
            result.push(node);
            this.operations.push(`Visited node ${node}`);

            for (let neighbor of this.adjList[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                    this.operations.push(`Pushed node ${neighbor} to stack`);
                }
            }
        }

        return result;
    }

    clear() {
        this.adjList = Array(this.vertices).fill(null).map(() => []);
        this.edges = [];
        this.operations = [];
    }
}

// ==================== VISUALIZATION ====================

function drawHeapTree(canvas, heap, isMinHeap) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (heap.length === 0) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = '14px monospace';
        ctx.fillText('Heap is empty', 50, 50);
        return;
    }

    const radius = 20;
    const levelHeight = 60;
    const positions = {};

    function calculatePositions(index, x, y, offsetX) {
        if (index >= heap.length) return;

        positions[index] = { x, y };

        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left < heap.length) {
            const childX = x - offsetX;
            const childY = y + levelHeight;
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(childX, childY);
            ctx.stroke();
            calculatePositions(left, childX, childY, offsetX / 2);
        }

        if (right < heap.length) {
            const childX = x + offsetX;
            const childY = y + levelHeight;
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(childX, childY);
            ctx.stroke();
            calculatePositions(right, childX, childY, offsetX / 2);
        }
    }

    calculatePositions(0, canvas.width / 2, 30, 60);

    // Draw nodes
    for (let [index, pos] of Object.entries(positions)) {
        ctx.fillStyle = isMinHeap ? '#3B82F6' : '#EF4444';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#F1F5F9';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(heap[index], pos.x, pos.y);
    }
}

function drawAVLTree(canvas, tree) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!tree.root) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = '14px monospace';
        ctx.fillText('Tree is empty', 50, 50);
        return;
    }

    const radius = 18;
    const levelHeight = 70;
    const positions = {};

    function drawNode(node, x, y, offsetX) {
        if (!node) return;

        positions[node.value] = { x, y };

        if (node.left) {
            const childX = x - offsetX;
            const childY = y + levelHeight;
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(childX, childY);
            ctx.stroke();
            drawNode(node.left, childX, childY, offsetX / 2);
        }

        if (node.right) {
            const childX = x + offsetX;
            const childY = y + levelHeight;
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(childX, childY);
            ctx.stroke();
            drawNode(node.right, childX, childY, offsetX / 2);
        }
    }

    drawNode(tree.root, canvas.width / 2, 30, 60);

    // Draw node circles
    function drawCircles(node) {
        if (!node) return;

        const pos = positions[node.value];
        const balance = tree.getBalance(node);
        
        // Color based on balance factor
        let color = '#3B82F6';
        if (Math.abs(balance) > 1) color = '#EF4444';
        else if (balance !== 0) color = '#F59E0B';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#F1F5F9';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value, pos.x, pos.y - 5);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#CBD5E1';
        ctx.fillText(`h:${node.height}`, pos.x, pos.y + 8);

        if (node.left) drawCircles(node.left);
        if (node.right) drawCircles(node.right);
    }

    drawCircles(tree.root);
}

function drawHashTable(canvas, hashTable) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bucketHeight = 40;
    const bucketWidth = 80;
    const startY = 20;

    hashTable.table.forEach((bucket, index) => {
        const y = startY + index * bucketHeight;
        
        ctx.fillStyle = bucket.length > 0 ? '#3B82F6' : '#334155';
        ctx.fillRect(20, y, bucketWidth, bucketHeight - 10);

        ctx.fillStyle = '#F1F5F9';
        ctx.font = '12px monospace';
        ctx.fillText(`Bucket ${index}`, 30, y + 12);

        if (bucket.length > 0) {
            ctx.fillStyle = '#10B981';
            ctx.font = '10px monospace';
            let xOffset = 105;
            bucket.forEach(([key, value], idx) => {
                ctx.fillText(`(${key}:${value})`, xOffset, y + 12);
                xOffset += 60;
                if (xOffset > canvas.width - 50) {
                    xOffset = 105;
                }
            });
        }
    });
}

function drawGraph(canvas, graph) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = 20;
    const positions = {};
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const graphRadius = Math.min(canvas.width, canvas.height) / 3;

    // Calculate node positions in a circle
    for (let i = 0; i < graph.vertices; i++) {
        const angle = (i / graph.vertices) * 2 * Math.PI - Math.PI / 2;
        positions[i] = {
            x: centerX + graphRadius * Math.cos(angle),
            y: centerY + graphRadius * Math.sin(angle)
        };
    }

    // Draw edges
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    graph.edges.forEach(([u, v]) => {
        ctx.beginPath();
        ctx.moveTo(positions[u].x, positions[u].y);
        ctx.lineTo(positions[v].x, positions[v].y);
        ctx.stroke();
    });

    // Draw nodes
    for (let i = 0; i < graph.vertices; i++) {
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#F1F5F9';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i, positions[i].x, positions[i].y);
    }
}

// ==================== GLOBAL INSTANCES ====================

let minHeap = new BinaryHeap(true);
let maxHeap = new BinaryHeap(false);
let currentHeap = minHeap;
let avlTree = new AVLTree();
let hashTable = new HashTable();
let graph = new Graph(6);

// ==================== EVENT LISTENERS ====================

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Heap operations
function heapInsert() {
    const input = document.getElementById('heapInput');
    const value = parseInt(input.value);

    if (isNaN(value) || value < 1 || value > 100) {
        addLog('heapLog', 'Invalid input!', 'error');
        return;
    }

    currentHeap.insert(value);
    updateHeapDisplay();
    addLog('heapLog', `✓ Inserted ${value}`, 'success');
    input.value = '';
}

function heapExtract() {
    if (currentHeap.heap.length === 0) {
        addLog('heapLog', 'Heap is empty!', 'error');
        return;
    }

    const value = currentHeap.extractRoot();
    updateHeapDisplay();
    addLog('heapLog', `✓ Extracted ${value}`, 'success');
}

function heapClear() {
    currentHeap.clear();
    updateHeapDisplay();
    addLog('heapLog', '✓ Heap cleared', 'success');
}

function updateHeapDisplay() {
    const heapArray = currentHeap.getArray();
    document.getElementById('heapSize').textContent = heapArray.length;
    document.getElementById('heapArray').textContent = heapArray.join(' → ') || 'Empty';

    const canvas = document.getElementById('heapCanvas');
    drawHeapTree(canvas, heapArray, currentHeap.isMinHeap);
}

// Change heap type
document.getElementById('heapType')?.addEventListener('change', (e) => {
    currentHeap = e.target.value === 'min' ? minHeap : maxHeap;
    updateHeapDisplay();
});

// AVL Tree operations
function avlInsert() {
    const input = document.getElementById('avlInput');
    const value = parseInt(input.value);

    if (isNaN(value) || value < 1 || value > 100) {
        addLog('avlLog', 'Invalid input!', 'error');
        return;
    }

    avlTree.insert(value);
    updateAVLDisplay();
    addLog('avlLog', `✓ Inserted ${value}`, 'success');
    input.value = '';
}

function avlDelete() {
    const input = document.getElementById('avlDeleteInput');
    const value = parseInt(input.value);

    if (isNaN(value)) {
        addLog('avlLog', 'Invalid input!', 'error');
        return;
    }

    avlTree.delete(value);
    updateAVLDisplay();
    addLog('avlLog', `✓ Deleted ${value}`, 'success');
    input.value = '';
}

function avlClear() {
    avlTree.clear();
    updateAVLDisplay();
    addLog('avlLog', '✓ Tree cleared', 'success');
}

function updateAVLDisplay() {
    const inorder = avlTree.inorder();
    document.getElementById('avlHeight').textContent = avlTree.getHeight(avlTree.root);
    document.getElementById('avlInorder').textContent = inorder.join(' → ') || 'Empty';

    const canvas = document.getElementById('avlCanvas');
    drawAVLTree(canvas, avlTree);
}

// Hash Table operations
function hashInsert() {
    const key = parseInt(document.getElementById('hashKey').value);
    const value = parseInt(document.getElementById('hashValue').value);

    if (isNaN(key) || isNaN(value)) {
        addLog('hashLog', 'Invalid input!', 'error');
        return;
    }

    hashTable.insert(key, value);
    updateHashDisplay();
    addLog('hashLog', `✓ Inserted (${key}:${value})`, 'success');
    document.getElementById('hashKey').value = '';
    document.getElementById('hashValue').value = '';
}

function hashSearch() {
    const key = parseInt(document.getElementById('hashSearchKey').value);

    if (isNaN(key)) {
        addLog('hashLog', 'Invalid input!', 'error');
        return;
    }

    const result = hashTable.search(key);
    if (result !== null) {
        addLog('hashLog', `✓ Found: (${key}:${result})`, 'success');
    } else {
        addLog('hashLog', `✗ Key ${key} not found`, 'error');
    }
}

function hashDelete() {
    const key = parseInt(document.getElementById('hashDeleteKey').value);

    if (isNaN(key)) {
        addLog('hashLog', 'Invalid input!', 'error');
        return;
    }

    hashTable.remove(key);
    updateHashDisplay();
    addLog('hashLog', `✓ Deleted key ${key}`, 'success');
    document.getElementById('hashDeleteKey').value = '';
}

function updateHashDisplay() {
    const state = hashTable.getState();
    let tableStr = '';
    state.forEach(bucket => {
        tableStr += `B${bucket.bucket}: `;
        bucket.entries.forEach(([k, v]) => {
            tableStr += `(${k}:${v}) `;
        });
        tableStr += ' | ';
    });
    document.getElementById('hashTable').textContent = tableStr || 'Empty';

    const canvas = document.getElementById('hashCanvas');
    drawHashTable(canvas, hashTable);
}

// Graph operations
function initGraph() {
    const vertices = parseInt(document.getElementById('graphVertices').value);
    if (isNaN(vertices) || vertices < 2 || vertices > 20) {
        addLog('graphLog', 'Invalid vertex count!', 'error');
        return;
    }

    graph = new Graph(vertices);
    updateGraphDisplay();
    addLog('graphLog', `✓ Graph initialized with ${vertices} vertices`, 'success');
}

function graphAddEdge() {
    const u = parseInt(document.getElementById('graphU').value);
    const v = parseInt(document.getElementById('graphV').value);

    if (isNaN(u) || isNaN(v)) {
        addLog('graphLog', 'Invalid input!', 'error');
        return;
    }

    graph.addEdge(u, v);
    updateGraphDisplay();
    addLog('graphLog', `✓ Edge added: ${u} ↔ ${v}`, 'success');
    document.getElementById('graphU').value = '';
    document.getElementById('graphV').value = '';
}

function graphBFS() {
    if (graph.vertices === 0) {
        addLog('graphLog', 'Initialize graph first!', 'error');
        return;
    }

    const result = graph.bfs(0);
    document.getElementById('graphResult').textContent = result.join(' → ');
    addLog('graphLog', `✓ BFS from node 0: ${result.join(' → ')}`, 'success');
}

function graphDFS() {
    if (graph.vertices === 0) {
        addLog('graphLog', 'Initialize graph first!', 'error');
        return;
    }

    const result = graph.dfs(0);
    document.getElementById('graphResult').textContent = result.join(' → ');
    addLog('graphLog', `✓ DFS from node 0: ${result.join(' → ')}`, 'success');
}

function updateGraphDisplay() {
    const canvas = document.getElementById('graphCanvas');
    drawGraph(canvas, graph);
}

// Utility function
function addLog(elementId, message, type = 'info') {
    const logContent = document.getElementById(elementId);
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `→ ${message}`;
    logContent.insertBefore(entry, logContent.firstChild);

    if (logContent.children.length > 10) {
        logContent.removeChild(logContent.lastChild);
    }
}

// Initialize displays
window.addEventListener('load', () => {
    updateHeapDisplay();
    updateAVLDisplay();
    updateHashDisplay();
    updateGraphDisplay();
});

// Responsive canvas handling
window.addEventListener('resize', () => {
    updateHeapDisplay();
    updateAVLDisplay();
    updateHashDisplay();
    updateGraphDisplay();
});
