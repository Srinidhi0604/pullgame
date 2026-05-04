export type Difficulty = "easy" | "medium" | "hard";

export interface Problem {
  slug: string;
  title: string;
  paper: string;
  difficulty: Difficulty;
  description: string;
  skeleton: string;
  tests: string;
  solveCount: number;
}

export const problems: Problem[] = [
  {
    slug: "scaled-dot-product-attention",
    title: "Scaled Dot-Product Attention",
    paper: "Attention Is All You Need (Vaswani et al., 2017)",
    difficulty: "medium",
    solveCount: 342,
    description: `# Scaled Dot-Product Attention

## Background
The Transformer architecture, introduced in *"Attention Is All You Need"* by Vaswani et al. (2017), revolutionized sequence modeling by replacing recurrence with self-attention mechanisms.

## The Mechanism
Scaled Dot-Product Attention computes attention weights by taking the dot product of queries (Q) with keys (K), scaling by √(d_k), applying softmax, and multiplying by values (V):

\`\`\`
Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V
\`\`\`

### Steps:
1. Compute **Q·Kᵀ** — the raw attention scores
2. **Scale** by dividing by √d_k to prevent large dot products from pushing softmax into regions with tiny gradients
3. (Optional) Apply a **mask** to prevent attending to certain positions (e.g., future tokens in autoregressive decoding)
4. Apply **softmax** to obtain attention weights
5. Multiply by **V** to get the weighted output

## Your Task
Implement \`scaled_dot_product_attention(q, k, v, mask=None)\` from scratch using only basic tensor operations.`,
    skeleton: `import numpy as np

def scaled_dot_product_attention(q: np.ndarray, k: np.ndarray, v: np.ndarray, mask: np.ndarray = None) -> np.ndarray:
    """
    Compute Scaled Dot-Product Attention.

    Args:
        q: Query matrix of shape (..., seq_len_q, d_k)
        k: Key matrix of shape (..., seq_len_k, d_k)
        v: Value matrix of shape (..., seq_len_k, d_v)
        mask: Optional mask of shape (..., seq_len_q, seq_len_k)

    Returns:
        output: Attention output of shape (..., seq_len_q, d_v)
    """
    # YOUR CODE HERE
    pass`,
    tests: `import numpy as np

def test_scaled_dot_product_attention():
    np.random.seed(42)
    q = np.random.randn(2, 4, 8)
    k = np.random.randn(2, 6, 8)
    v = np.random.randn(2, 6, 16)

    output = scaled_dot_product_attention(q, k, v)

    # Shape check
    assert output.shape == (2, 4, 16), f"Expected shape (2, 4, 16), got {output.shape}"

    # Attention weights should sum to 1
    d_k = q.shape[-1]
    scores = q @ k.transpose(0, 2, 1) / np.sqrt(d_k)
    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
    expected = weights @ v
    np.testing.assert_allclose(output, expected, rtol=1e-5)

    print("All tests passed!")`,
  },
  {
    slug: "layer-normalization",
    title: "Layer Normalization",
    paper: "Layer Normalization (Ba, Kiros & Hinton, 2016)",
    difficulty: "easy",
    solveCount: 521,
    description: `# Layer Normalization

## Background
*Layer Normalization* (Ba et al., 2016) normalizes activations across the feature dimension for each individual sample, unlike Batch Normalization which normalizes across the batch.

## The Math
For an input x of shape (batch, features):
\`\`\`
μ = mean(x, axis=-1)
σ² = var(x, axis=-1)
x̂ = (x - μ) / √(σ² + ε)
y = γ · x̂ + β
\`\`\`

Where γ (gain) and β (bias) are learnable parameters.

## Your Task
Implement the forward pass of Layer Normalization from scratch — no \`nn.LayerNorm\` allowed.`,
    skeleton: `import numpy as np

def layer_norm(x: np.ndarray, gamma: np.ndarray, beta: np.ndarray, eps: float = 1e-5) -> np.ndarray:
    """
    Apply Layer Normalization.

    Args:
        x: Input of shape (batch_size, features)
        gamma: Scale parameter of shape (features,)
        beta: Shift parameter of shape (features,)
        eps: Small constant for numerical stability

    Returns:
        Normalized output of shape (batch_size, features)
    """
    # YOUR CODE HERE
    pass`,
    tests: `import numpy as np

def test_layer_norm():
    np.random.seed(42)
    x = np.random.randn(4, 8)
    gamma = np.ones(8)
    beta = np.zeros(8)

    output = layer_norm(x, gamma, beta)

    assert output.shape == x.shape
    # After normalization, each row should have ~0 mean and ~1 std
    np.testing.assert_allclose(output.mean(axis=-1), 0, atol=1e-6)
    np.testing.assert_allclose(output.std(axis=-1), 1, atol=0.1)

    print("All tests passed!")`,
  },
  {
    slug: "positional-encoding",
    title: "Sinusoidal Positional Encoding",
    paper: "Attention Is All You Need (Vaswani et al., 2017)",
    difficulty: "easy",
    solveCount: 487,
    description: `# Sinusoidal Positional Encoding

## Background
Since the Transformer has no recurrence or convolution, it needs positional information injected into the input embeddings. The original paper uses fixed sinusoidal functions.

## The Formula
\`\`\`
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
\`\`\`

Where \`pos\` is the position and \`i\` is the dimension index. This creates unique encodings for each position that the model can learn to attend to.

## Your Task
Generate the full positional encoding matrix for a given sequence length and model dimension.`,
    skeleton: `import numpy as np

def positional_encoding(seq_len: int, d_model: int) -> np.ndarray:
    """
    Generate sinusoidal positional encodings.

    Args:
        seq_len: Length of the sequence
        d_model: Dimension of the model (must be even)

    Returns:
        Positional encoding matrix of shape (seq_len, d_model)
    """
    # YOUR CODE HERE
    pass`,
    tests: `import numpy as np

def test_positional_encoding():
    pe = positional_encoding(50, 64)

    assert pe.shape == (50, 64)
    # Even indices should be sin, odd should be cos
    # PE values should be between -1 and 1
    assert pe.min() >= -1.0 and pe.max() <= 1.0
    # Position 0 should have sin(0)=0 for even dims
    np.testing.assert_allclose(pe[0, 0], 0.0, atol=1e-7)

    print("All tests passed!")`,
  },
  {
    slug: "multi-head-attention",
    title: "Multi-Head Attention",
    paper: "Attention Is All You Need (Vaswani et al., 2017)",
    difficulty: "hard",
    solveCount: 156,
    description: `# Multi-Head Attention

## Background
Instead of performing a single attention function, Multi-Head Attention runs multiple attention heads in parallel, each with different learned linear projections.

## The Mechanism
\`\`\`
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W_O
where head_i = Attention(Q·W_Q_i, K·W_K_i, V·W_V_i)
\`\`\`

Each head operates on a d_k = d_model/h dimensional subspace, allowing the model to jointly attend to information from different representation subspaces.

## Your Task
Implement the full Multi-Head Attention mechanism including linear projections, splitting into heads, scaled dot-product attention, concatenation, and output projection.`,
    skeleton: `import numpy as np

class MultiHeadAttention:
    def __init__(self, d_model: int, num_heads: int):
        """
        Args:
            d_model: Model dimension
            num_heads: Number of attention heads
        """
        # YOUR CODE HERE - initialize weight matrices
        pass

    def forward(self, q: np.ndarray, k: np.ndarray, v: np.ndarray, mask=None) -> np.ndarray:
        """
        Args:
            q: Queries of shape (batch, seq_len, d_model)
            k: Keys of shape (batch, seq_len, d_model)
            v: Values of shape (batch, seq_len, d_model)

        Returns:
            Output of shape (batch, seq_len, d_model)
        """
        # YOUR CODE HERE
        pass`,
    tests: `import numpy as np

def test_multi_head_attention():
    np.random.seed(42)
    mha = MultiHeadAttention(d_model=64, num_heads=8)

    q = np.random.randn(2, 10, 64)
    k = np.random.randn(2, 10, 64)
    v = np.random.randn(2, 10, 64)

    output = mha.forward(q, k, v)
    assert output.shape == (2, 10, 64), f"Expected (2, 10, 64), got {output.shape}"

    print("All tests passed!")`,
  },
  {
    slug: "batch-normalization",
    title: "Batch Normalization",
    paper: "Batch Normalization: Accelerating Deep Network Training (Ioffe & Szegedy, 2015)",
    difficulty: "medium",
    solveCount: 398,
    description: `# Batch Normalization

## Background
Batch Normalization (Ioffe & Szegedy, 2015) addresses the problem of *internal covariate shift* by normalizing each mini-batch.

## The Math (Training Mode)
\`\`\`
μ_B = (1/m) Σ x_i
σ²_B = (1/m) Σ (x_i - μ_B)²
x̂_i = (x_i - μ_B) / √(σ²_B + ε)
y_i = γ · x̂_i + β
\`\`\`

During inference, running statistics (exponential moving average) are used instead of batch statistics.

## Your Task
Implement BatchNorm with both training and inference modes, including running mean/variance tracking.`,
    skeleton: `import numpy as np

class BatchNorm:
    def __init__(self, num_features: int, eps: float = 1e-5, momentum: float = 0.1):
        self.gamma = np.ones(num_features)
        self.beta = np.zeros(num_features)
        self.running_mean = np.zeros(num_features)
        self.running_var = np.ones(num_features)
        self.eps = eps
        self.momentum = momentum

    def forward(self, x: np.ndarray, training: bool = True) -> np.ndarray:
        """
        Args:
            x: Input of shape (batch_size, num_features)
            training: Whether in training mode

        Returns:
            Normalized output of shape (batch_size, num_features)
        """
        # YOUR CODE HERE
        pass`,
    tests: `import numpy as np

def test_batch_norm():
    np.random.seed(42)
    bn = BatchNorm(num_features=8)
    x = np.random.randn(32, 8) * 5 + 3

    out_train = bn.forward(x, training=True)
    assert out_train.shape == x.shape
    np.testing.assert_allclose(out_train.mean(axis=0), 0, atol=1e-6)

    print("All tests passed!")`,
  },
  {
    slug: "adam-optimizer",
    title: "Adam Optimizer",
    paper: "Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)",
    difficulty: "medium",
    solveCount: 275,
    description: `# Adam Optimizer

## Background
Adam combines the benefits of AdaGrad (per-parameter learning rates) and RMSProp (moving average of squared gradients) with bias correction.

## The Algorithm
\`\`\`
m_t = β₁ · m_{t-1} + (1 - β₁) · g_t        # First moment
v_t = β₂ · v_{t-1} + (1 - β₂) · g_t²        # Second moment
m̂_t = m_t / (1 - β₁ᵗ)                       # Bias correction
v̂_t = v_t / (1 - β₂ᵗ)                       # Bias correction
θ_t = θ_{t-1} - α · m̂_t / (√v̂_t + ε)      # Update
\`\`\`

## Your Task
Implement the Adam optimizer step function that updates parameters given gradients.`,
    skeleton: `import numpy as np

class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = None
        self.v = None
        self.t = 0

    def step(self, params: np.ndarray, grads: np.ndarray) -> np.ndarray:
        """
        Perform one Adam update step.

        Args:
            params: Current parameters
            grads: Gradients w.r.t. parameters

        Returns:
            Updated parameters
        """
        # YOUR CODE HERE
        pass`,
    tests: `import numpy as np

def test_adam():
    np.random.seed(42)
    adam = Adam(lr=0.01)
    params = np.array([1.0, 2.0, 3.0])
    grads = np.array([0.1, -0.2, 0.3])

    new_params = adam.step(params, grads)
    assert new_params.shape == params.shape
    # Parameters should have changed
    assert not np.allclose(new_params, params)

    print("All tests passed!")`,
  },
  {
    slug: "dropout",
    title: "Dropout",
    paper: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting (Srivastava et al., 2014)",
    difficulty: "easy",
    solveCount: 612,
    description: `# Dropout

## Background
Dropout (Srivastava et al., 2014) is a regularization technique that randomly zeroes elements during training, preventing co-adaptation of neurons.

## The Mechanism
During **training**: Each element is independently set to zero with probability \`p\`, and the remaining elements are scaled by \`1/(1-p)\` (inverted dropout).

During **inference**: No dropout is applied; the output equals the input.

## Your Task
Implement inverted dropout with both training and inference modes.`,
    skeleton: `import numpy as np

def dropout(x: np.ndarray, p: float = 0.5, training: bool = True) -> np.ndarray:
    """
    Apply inverted dropout.

    Args:
        x: Input tensor
        p: Probability of dropping an element
        training: Whether in training mode

    Returns:
        Output with dropout applied (same shape as x)
    """
    # YOUR CODE HERE
    pass`,
    tests: `import numpy as np

def test_dropout():
    np.random.seed(42)
    x = np.ones((1000, 100))

    # Training mode: ~50% should be zero
    out = dropout(x, p=0.5, training=True)
    assert out.shape == x.shape
    zero_frac = (out == 0).mean()
    assert 0.4 < zero_frac < 0.6, f"Expected ~50% zeros, got {zero_frac:.2%}"

    # Inference mode: output should equal input
    out_eval = dropout(x, p=0.5, training=False)
    np.testing.assert_array_equal(out_eval, x)

    print("All tests passed!")`,
  },
  {
    slug: "cross-entropy-loss",
    title: "Cross Entropy Loss",
    paper: "Foundational — Information Theory (Shannon, 1948)",
    difficulty: "easy",
    solveCount: 589,
    description: `# Cross Entropy Loss

## Background
Cross-entropy measures the difference between two probability distributions and is the standard loss function for classification tasks.

## The Formula
For a single sample with true class \`y\` and predicted probabilities \`p\`:
\`\`\`
L = -log(p[y])
\`\`\`

For a batch, average over all samples. You must first apply softmax to convert logits to probabilities.

## Your Task
Implement cross-entropy loss from logits (including the softmax step) with numerical stability.`,
    skeleton: `import numpy as np

def cross_entropy_loss(logits: np.ndarray, targets: np.ndarray) -> float:
    """
    Compute cross-entropy loss from logits.

    Args:
        logits: Raw scores of shape (batch_size, num_classes)
        targets: Integer class labels of shape (batch_size,)

    Returns:
        Scalar loss value
    """
    # YOUR CODE HERE
    pass`,
    tests: `import numpy as np

def test_cross_entropy():
    # Perfect prediction should give near-zero loss
    logits = np.array([[10.0, 0.0, 0.0], [0.0, 10.0, 0.0]])
    targets = np.array([0, 1])
    loss = cross_entropy_loss(logits, targets)
    assert loss < 0.01, f"Perfect prediction loss too high: {loss}"

    # Random prediction should give higher loss
    logits_random = np.zeros((2, 3))
    loss_random = cross_entropy_loss(logits_random, targets)
    assert loss_random > 1.0

    print("All tests passed!")`,
  },
  {
    slug: "transformer-encoder",
    title: "Transformer Encoder Block",
    paper: "Attention Is All You Need (Vaswani et al., 2017)",
    difficulty: "hard",
    solveCount: 98,
    description: `# Transformer Encoder Block

## Background
The Transformer Encoder consists of two sub-layers: Multi-Head Self-Attention and a Position-wise Feed-Forward Network, each followed by residual connections and layer normalization.

## Architecture
\`\`\`
x → MultiHeadAttention(x, x, x) → Add & LayerNorm → FFN → Add & LayerNorm → output
\`\`\`

The FFN consists of two linear transformations with a ReLU in between:
\`\`\`
FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂
\`\`\`

## Your Task
Implement a complete Transformer Encoder block combining self-attention, FFN, residual connections, and layer normalization.`,
    skeleton: `import numpy as np

class TransformerEncoderBlock:
    def __init__(self, d_model: int, num_heads: int, d_ff: int):
        """
        Args:
            d_model: Model dimension
            num_heads: Number of attention heads
            d_ff: Feed-forward hidden dimension
        """
        # YOUR CODE HERE - initialize all sub-layers
        pass

    def forward(self, x: np.ndarray, mask=None) -> np.ndarray:
        """
        Args:
            x: Input of shape (batch, seq_len, d_model)

        Returns:
            Output of shape (batch, seq_len, d_model)
        """
        # YOUR CODE HERE
        pass`,
    tests: `import numpy as np

def test_transformer_encoder():
    np.random.seed(42)
    encoder = TransformerEncoderBlock(d_model=64, num_heads=8, d_ff=256)
    x = np.random.randn(2, 10, 64)

    output = encoder.forward(x)
    assert output.shape == (2, 10, 64)

    print("All tests passed!")`,
  },
  {
    slug: "backprop-mlp",
    title: "Backpropagation Through MLP",
    paper: "Foundational — Learning representations by back-propagating errors (Rumelhart et al., 1986)",
    difficulty: "medium",
    solveCount: 231,
    description: `# Backpropagation Through MLP

## Background
Backpropagation is the cornerstone algorithm for training neural networks, using the chain rule to compute gradients of the loss with respect to each parameter.

## The Setup
A simple 2-layer MLP:
\`\`\`
z₁ = x · W₁ + b₁
a₁ = ReLU(z₁)
z₂ = a₁ · W₂ + b₂
loss = MSE(z₂, y)
\`\`\`

## Your Task
Implement the full forward and backward pass, computing gradients for W₁, b₁, W₂, b₂.`,
    skeleton: `import numpy as np

class MLP:
    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):
        self.W1 = np.random.randn(input_dim, hidden_dim) * 0.01
        self.b1 = np.zeros(hidden_dim)
        self.W2 = np.random.randn(hidden_dim, output_dim) * 0.01
        self.b2 = np.zeros(output_dim)

    def forward(self, x: np.ndarray) -> np.ndarray:
        """Forward pass. Store intermediates for backward."""
        # YOUR CODE HERE
        pass

    def backward(self, x: np.ndarray, y: np.ndarray) -> dict:
        """
        Compute gradients via backpropagation.

        Returns:
            Dictionary with keys 'dW1', 'db1', 'dW2', 'db2'
        """
        # YOUR CODE HERE
        pass`,
    tests: `import numpy as np

def test_backprop():
    np.random.seed(42)
    mlp = MLP(input_dim=4, hidden_dim=8, output_dim=2)
    x = np.random.randn(16, 4)
    y = np.random.randn(16, 2)

    out = mlp.forward(x)
    assert out.shape == (16, 2)

    grads = mlp.backward(x, y)
    assert grads['dW1'].shape == (4, 8)
    assert grads['dW2'].shape == (8, 2)

    print("All tests passed!")`,
  },
];

export const difficultyConfig = {
  easy: { label: "Easy", color: "#10b981", weight: 1 },
  medium: { label: "Medium", color: "#f59e0b", weight: 2 },
  hard: { label: "Hard", color: "#ef4444", weight: 3 },
};
