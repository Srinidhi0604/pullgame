export type Difficulty = "easy" | "medium" | "hard";

export interface Task {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  skeleton: string;
  tests: string;
  solveCount: number;
}

export interface Paper {
  slug: string;
  title: string;
  year: number;
  authors: string[];
  tags: string[];
  description: string;
  paperUrl: string;
  tasks: Task[];
}

export const papers: Paper[] = [
  {
    slug: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    year: 2017,
    authors: ["Vaswani", "Shazeer", "Parmar", "et al."],
    tags: ["NLP", "Transformer", "Attention"],
    paperUrl: "https://arxiv.org/abs/1706.03762",
    description:
      "The Transformer architecture replacing recurrence with self-attention mechanisms, enabling parallel training and achieving state-of-the-art results in machine translation.",
    tasks: [
      {
        slug: "scaled-dot-product-attention",
        title: "Scaled Dot-Product Attention",
        difficulty: "medium",
        category: "Micro",
        solveCount: 342,
        description: `# Scaled Dot-Product Attention

## Problem Description

After understanding the core building block of the Transformer, implement the Scaled Dot-Product Attention mechanism from scratch.

The attention function computes a weighted sum of values (V) where the weights are determined by the compatibility of queries (Q) with keys (K).

## The Mechanism

\`\`\`
Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V
\`\`\`

### Steps:
1. Compute **Q·Kᵀ** — the raw attention scores
2. **Scale** by dividing by √d_k to prevent large dot products
3. (Optional) Apply a **mask** for causal attention
4. Apply **softmax** to obtain attention weights
5. Multiply by **V** to get the weighted output

## Mathematical Formulation

Given queries Q of shape (seq_q, d_k), keys K of shape (seq_k, d_k), and values V of shape (seq_k, d_v):

\`\`\`
scores = Q · Kᵀ / √d_k
weights = softmax(scores, axis=-1)
output = weights · V
\`\`\`

Where:
- The scaling factor √d_k prevents the dot products from growing too large
- Softmax is applied row-wise to normalize attention weights
- The output has shape (seq_q, d_v)`,
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
    raise NotImplementedError`,
        tests: `import numpy as np

def test_scaled_dot_product_attention():
    np.random.seed(42)
    q = np.random.randn(2, 4, 8)
    k = np.random.randn(2, 6, 8)
    v = np.random.randn(2, 6, 16)

    output = scaled_dot_product_attention(q, k, v)

    assert output.shape == (2, 4, 16), f"Expected shape (2, 4, 16), got {output.shape}"

    d_k = q.shape[-1]
    scores = q @ k.transpose(0, 2, 1) / np.sqrt(d_k)
    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
    expected = weights @ v
    np.testing.assert_allclose(output, expected, rtol=1e-5)

    print("All tests passed!")`,
      },
      {
        slug: "positional-encoding",
        title: "Sinusoidal Positional Encoding",
        difficulty: "easy",
        category: "Micro",
        solveCount: 487,
        description: `# Sinusoidal Positional Encoding

## Problem Description

Since the Transformer has no recurrence or convolution, it needs positional information injected into the input embeddings. The original paper uses fixed sinusoidal functions.

## The Formula

\`\`\`
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
\`\`\`

Where \`pos\` is the position and \`i\` is the dimension index.

## Mathematical Formulation

For each position pos in [0, seq_len) and dimension i in [0, d_model/2):
- Even dimensions: sin(pos / 10000^(2i/d_model))
- Odd dimensions: cos(pos / 10000^(2i/d_model))

This creates unique, deterministic encodings that allow the model to learn relative positions.`,
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
    raise NotImplementedError`,
        tests: `import numpy as np

def test_positional_encoding():
    pe = positional_encoding(50, 64)

    assert pe.shape == (50, 64)
    assert pe.min() >= -1.0 and pe.max() <= 1.0
    np.testing.assert_allclose(pe[0, 0], 0.0, atol=1e-7)

    print("All tests passed!")`,
      },
      {
        slug: "multi-head-attention",
        title: "Multi-Head Attention",
        difficulty: "hard",
        category: "Micro",
        solveCount: 156,
        description: `# Multi-Head Attention

## Problem Description

Instead of performing a single attention function, Multi-Head Attention runs multiple attention heads in parallel, each with different learned linear projections.

## The Mechanism

\`\`\`
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W_O
where head_i = Attention(Q·W_Q_i, K·W_K_i, V·W_V_i)
\`\`\`

Each head operates on a d_k = d_model/h dimensional subspace.

## Your Task

Implement the full Multi-Head Attention mechanism including:
- Linear projections for Q, K, V
- Splitting into multiple heads
- Scaled dot-product attention per head
- Concatenation and output projection`,
        skeleton: `import numpy as np

class MultiHeadAttention:
    def __init__(self, d_model: int, num_heads: int):
        """
        Args:
            d_model: Model dimension
            num_heads: Number of attention heads
        """
        # YOUR CODE HERE - initialize weight matrices
        raise NotImplementedError

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
        raise NotImplementedError`,
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
        slug: "transformer-encoder",
        title: "Transformer Encoder Block",
        difficulty: "hard",
        category: "Micro",
        solveCount: 98,
        description: `# Transformer Encoder Block

## Problem Description

The Transformer Encoder consists of two sub-layers: Multi-Head Self-Attention and a Position-wise Feed-Forward Network, each followed by residual connections and layer normalization.

## Architecture

\`\`\`
x → MultiHeadAttention(x, x, x) → Add & LayerNorm → FFN → Add & LayerNorm → output
\`\`\`

The FFN consists of two linear transformations with a ReLU activation:
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
        # YOUR CODE HERE
        raise NotImplementedError

    def forward(self, x: np.ndarray, mask=None) -> np.ndarray:
        """
        Args:
            x: Input of shape (batch, seq_len, d_model)
        Returns:
            Output of shape (batch, seq_len, d_model)
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_transformer_encoder():
    np.random.seed(42)
    encoder = TransformerEncoderBlock(d_model=64, num_heads=8, d_ff=256)
    x = np.random.randn(2, 10, 64)

    output = encoder.forward(x)
    assert output.shape == (2, 10, 64)

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "batch-normalization",
    title: "Batch Normalization: Accelerating Deep Network Training",
    year: 2015,
    authors: ["Ioffe", "Szegedy"],
    tags: ["Deep Learning", "Optimization", "Normalization"],
    paperUrl: "https://arxiv.org/abs/1502.03167",
    description:
      "Addresses the problem of internal covariate shift by normalizing each mini-batch, enabling higher learning rates and reducing the dependence on careful initialization.",
    tasks: [
      {
        slug: "batch-norm-forward",
        title: "Batch Normalization Forward",
        difficulty: "medium",
        category: "Micro",
        solveCount: 398,
        description: `# Batch Normalization

## Problem Description

Batch Normalization (Ioffe & Szegedy, 2015) normalizes each mini-batch to address internal covariate shift.

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
        raise NotImplementedError`,
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
    ],
  },
  {
    slug: "adam-optimizer",
    title: "Adam: A Method for Stochastic Optimization",
    year: 2015,
    authors: ["Kingma", "Ba"],
    tags: ["Optimization", "Deep Learning"],
    paperUrl: "https://arxiv.org/abs/1412.6980",
    description:
      "Adaptive moment estimation optimizer combining benefits of RMSProp and momentum, computing individual adaptive learning rates for different parameters.",
    tasks: [
      {
        slug: "adam-step",
        title: "Adam Optimizer Step",
        difficulty: "medium",
        category: "Micro",
        solveCount: 275,
        description: `# Adam Optimizer

## Problem Description

Adam combines the benefits of AdaGrad (per-parameter learning rates) and RMSProp (moving average of squared gradients) with bias correction.

## The Algorithm

\`\`\`
m_t = β₁ · m_{t-1} + (1 - β₁) · g_t
v_t = β₂ · v_{t-1} + (1 - β₂) · g_t²
m̂_t = m_t / (1 - β₁ᵗ)
v̂_t = v_t / (1 - β₂ᵗ)
θ_t = θ_{t-1} - α · m̂_t / (√v̂_t + ε)
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
        raise NotImplementedError`,
        tests: `import numpy as np

def test_adam():
    np.random.seed(42)
    adam = Adam(lr=0.01)
    params = np.array([1.0, 2.0, 3.0])
    grads = np.array([0.1, -0.2, 0.3])

    new_params = adam.step(params, grads)
    assert new_params.shape == params.shape
    assert not np.allclose(new_params, params)

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "dropout-regularization",
    title: "Dropout: Preventing Neural Network Overfitting",
    year: 2014,
    authors: ["Srivastava", "Hinton", "Krizhevsky", "et al."],
    tags: ["Regularization", "Deep Learning"],
    paperUrl: "https://jmlr.org/papers/v15/srivastava14a.html",
    description:
      "A simple yet powerful regularization technique that randomly zeroes elements during training, preventing co-adaptation of neurons and improving generalization.",
    tasks: [
      {
        slug: "inverted-dropout",
        title: "Inverted Dropout",
        difficulty: "easy",
        category: "Micro",
        solveCount: 612,
        description: `# Dropout

## Problem Description

Dropout (Srivastava et al., 2014) is a regularization technique that randomly zeroes elements during training.

## The Mechanism

During **training**: Each element is independently set to zero with probability p, and the remaining elements are scaled by 1/(1-p) (inverted dropout).

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
    raise NotImplementedError`,
        tests: `import numpy as np

def test_dropout():
    np.random.seed(42)
    x = np.ones((1000, 100))

    out = dropout(x, p=0.5, training=True)
    assert out.shape == x.shape
    zero_frac = (out == 0).mean()
    assert 0.4 < zero_frac < 0.6, f"Expected ~50% zeros, got {zero_frac:.2%}"

    out_eval = dropout(x, p=0.5, training=False)
    np.testing.assert_array_equal(out_eval, x)

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "layer-normalization",
    title: "Layer Normalization",
    year: 2016,
    authors: ["Ba", "Kiros", "Hinton"],
    tags: ["Deep Learning", "Normalization"],
    paperUrl: "https://arxiv.org/abs/1607.06450",
    description:
      "Normalizes activations across the feature dimension for each individual sample, unlike Batch Normalization which normalizes across the batch. Essential in Transformers.",
    tasks: [
      {
        slug: "layer-norm-forward",
        title: "Layer Normalization Forward",
        difficulty: "easy",
        category: "Micro",
        solveCount: 521,
        description: `# Layer Normalization

## Problem Description

Layer Normalization (Ba et al., 2016) normalizes activations across the feature dimension for each individual sample.

## The Math

\`\`\`
μ = mean(x, axis=-1)
σ² = var(x, axis=-1)
x̂ = (x - μ) / √(σ² + ε)
y = γ · x̂ + β
\`\`\`

Where γ (gain) and β (bias) are learnable parameters.

## Your Task

Implement the forward pass of Layer Normalization from scratch.`,
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
    raise NotImplementedError`,
        tests: `import numpy as np

def test_layer_norm():
    np.random.seed(42)
    x = np.random.randn(4, 8)
    gamma = np.ones(8)
    beta = np.zeros(8)

    output = layer_norm(x, gamma, beta)

    assert output.shape == x.shape
    np.testing.assert_allclose(output.mean(axis=-1), 0, atol=1e-6)
    np.testing.assert_allclose(output.std(axis=-1), 1, atol=0.1)

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "cross-entropy",
    title: "Cross Entropy Loss",
    year: 1948,
    authors: ["Shannon"],
    tags: ["Foundational", "Information Theory"],
    paperUrl: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf",
    description:
      "Cross-entropy measures the difference between two probability distributions. It is the standard loss function for classification tasks in deep learning.",
    tasks: [
      {
        slug: "cross-entropy-loss",
        title: "Cross Entropy from Logits",
        difficulty: "easy",
        category: "Micro",
        solveCount: 589,
        description: `# Cross Entropy Loss

## Problem Description

Cross-entropy measures the difference between two probability distributions and is the standard loss function for classification tasks.

## The Formula

For a single sample with true class y and predicted probabilities p:
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
    raise NotImplementedError`,
        tests: `import numpy as np

def test_cross_entropy():
    logits = np.array([[10.0, 0.0, 0.0], [0.0, 10.0, 0.0]])
    targets = np.array([0, 1])
    loss = cross_entropy_loss(logits, targets)
    assert loss < 0.01, f"Perfect prediction loss too high: {loss}"

    logits_random = np.zeros((2, 3))
    loss_random = cross_entropy_loss(logits_random, targets)
    assert loss_random > 1.0

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "backpropagation",
    title: "Learning Representations by Back-Propagating Errors",
    year: 1986,
    authors: ["Rumelhart", "Hinton", "Williams"],
    tags: ["Foundational", "Neural Networks"],
    paperUrl: "https://www.nature.com/articles/323533a0",
    description:
      "The cornerstone algorithm for training neural networks, using the chain rule to compute gradients of the loss with respect to each parameter through automatic differentiation.",
    tasks: [
      {
        slug: "backprop-mlp",
        title: "Backpropagation Through MLP",
        difficulty: "medium",
        category: "Micro",
        solveCount: 231,
        description: `# Backpropagation Through MLP

## Problem Description

Backpropagation uses the chain rule to compute gradients of the loss with respect to each parameter.

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
        raise NotImplementedError

    def backward(self, x: np.ndarray, y: np.ndarray) -> dict:
        """
        Compute gradients via backpropagation.
        Returns:
            Dictionary with keys 'dW1', 'db1', 'dW2', 'db2'
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
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
    ],
  },

  // ─── NEW PAPERS ───────────────────────────────────────────

  {
    slug: "deep-residual-learning",
    title: "Deep Residual Learning for Image Recognition",
    year: 2015,
    authors: ["He", "Zhang", "Ren", "Sun"],
    tags: ["Computer Vision", "CNN", "Residual Networks"],
    paperUrl: "https://arxiv.org/abs/1512.03385",
    description:
      "Introduces skip connections (residual connections) that allow gradients to flow directly through identity shortcuts, enabling training of networks with hundreds of layers and winning ILSVRC 2015.",
    tasks: [
      {
        slug: "residual-block",
        title: "Residual Block Forward Pass",
        difficulty: "medium",
        category: "Micro",
        solveCount: 487,
        description: `# Residual Block

## Problem Description

The core innovation of ResNet is the **residual connection** — adding the input directly to the output of a transformation block.

## The Formula

\`\`\`
y = F(x, {Wᵢ}) + x
\`\`\`

Where F is the residual mapping (Conv → BN → ReLU → Conv → BN) and x is the identity shortcut.

## Steps

1. Pass x through the two-layer transformation F(x)
2. Add x directly to the result (skip connection)
3. Apply ReLU after the addition

## Your Task

Implement a basic residual block forward pass using numpy (no actual convolutions — use linear projections to simulate the idea).`,
        skeleton: `import numpy as np

def residual_block(x: np.ndarray, W1: np.ndarray, W2: np.ndarray) -> np.ndarray:
    """
    Simulate a residual block forward pass.

    Args:
        x:  Input of shape (batch, features)
        W1: First linear projection weights (features, features)
        W2: Second linear projection weights (features, features)

    Returns:
        Output of shape (batch, features) after residual addition and ReLU
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_output_shape():
    np.random.seed(0)
    x  = np.random.randn(4, 16)
    W1 = np.random.randn(16, 16) * 0.1
    W2 = np.random.randn(16, 16) * 0.1
    out = residual_block(x, W1, W2)
    assert out.shape == (4, 16), f"Expected (4,16), got {out.shape}"
    print("Shape test passed")

def test_residual_connection():
    np.random.seed(1)
    x  = np.random.randn(2, 8)
    W1 = np.zeros((8, 8))
    W2 = np.zeros((8, 8))
    out = residual_block(x, W1, W2)
    # With zero weights F(x)=0, output should be ReLU(x)
    expected = np.maximum(0, x)
    np.testing.assert_allclose(out, expected, atol=1e-6)
    print("Residual connection test passed")`,
      },
    ],
  },

  {
    slug: "auto-encoding-variational-bayes",
    title: "Auto-Encoding Variational Bayes (VAE)",
    year: 2013,
    authors: ["Kingma", "Welling"],
    tags: ["Generative Models", "Deep Learning", "Latent Space"],
    paperUrl: "https://arxiv.org/abs/1312.6114",
    description:
      "Introduces the Variational Autoencoder, a generative model that learns a structured latent space by encoding inputs to Gaussian distributions and training with the ELBO objective.",
    tasks: [
      {
        slug: "reparameterization-trick",
        title: "Reparameterization Trick",
        difficulty: "easy",
        category: "Micro",
        solveCount: 398,
        description: `# Reparameterization Trick

## Problem Description

In a VAE, the encoder outputs a **mean** μ and **log-variance** log(σ²). To sample from z ~ N(μ, σ²) in a differentiable way, we use the reparameterization trick.

## The Formula

\`\`\`
z = μ + σ * ε    where ε ~ N(0, I)
\`\`\`

This separates the randomness (ε) from the parameters (μ, σ), making the sampling step differentiable.

## Your Task

Implement the reparameterization trick given mu and log_var.`,
        skeleton: `import numpy as np

def reparameterize(mu: np.ndarray, log_var: np.ndarray) -> np.ndarray:
    """
    Sample z using the reparameterization trick.

    Args:
        mu:      Mean vector of shape (batch, latent_dim)
        log_var: Log-variance of shape (batch, latent_dim)

    Returns:
        z: Sampled latent vector of same shape
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_shape():
    np.random.seed(42)
    mu = np.zeros((8, 16))
    log_var = np.zeros((8, 16))
    z = reparameterize(mu, log_var)
    assert z.shape == (8, 16), f"Expected (8,16), got {z.shape}"
    print("Shape test passed")

def test_zero_variance():
    np.random.seed(0)
    mu = np.array([[1.0, 2.0, 3.0]])
    log_var = np.full((1, 3), -1e9)   # sigma ≈ 0
    z = reparameterize(mu, log_var)
    np.testing.assert_allclose(z, mu, atol=1e-3)
    print("Zero variance test passed")`,
      },
      {
        slug: "kl-divergence-gaussian",
        title: "KL Divergence (Gaussian)",
        difficulty: "medium",
        category: "Micro",
        solveCount: 271,
        description: `# KL Divergence for VAE

## Problem Description

The VAE loss has two terms:
1. **Reconstruction loss** (e.g. BCE or MSE)
2. **KL divergence** — regularization pushing the posterior q(z|x) toward the prior N(0, I)

## The Formula

For a diagonal Gaussian posterior with parameters μ and σ²:

\`\`\`
KL = -0.5 * Σ (1 + log(σ²) - μ² - σ²)
\`\`\`

Summed over latent dimensions, averaged over the batch.

## Your Task

Implement the KL divergence term given mu and log_var.`,
        skeleton: `import numpy as np

def kl_divergence(mu: np.ndarray, log_var: np.ndarray) -> float:
    """
    KL divergence from N(mu, sigma^2) to N(0, I).

    Args:
        mu:      Shape (batch, latent_dim)
        log_var: Shape (batch, latent_dim)

    Returns:
        Scalar KL loss (averaged over batch)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_zero_kl():
    mu = np.zeros((4, 8))
    log_var = np.zeros((4, 8))  # sigma=1
    kl = kl_divergence(mu, log_var)
    assert abs(kl) < 1e-6, f"KL should be 0 for standard normal, got {kl}"
    print("Zero KL test passed")

def test_positive():
    np.random.seed(5)
    mu = np.random.randn(4, 8)
    log_var = np.random.randn(4, 8)
    kl = kl_divergence(mu, log_var)
    assert kl >= 0, f"KL divergence must be non-negative, got {kl}"
    print("Positivity test passed")`,
      },
    ],
  },

  {
    slug: "generative-adversarial-networks",
    title: "Generative Adversarial Networks",
    year: 2014,
    authors: ["Goodfellow", "Pouget-Abadie", "Mirza", "et al."],
    tags: ["Generative Models", "Deep Learning", "GANs"],
    paperUrl: "https://arxiv.org/abs/1406.2661",
    description:
      "Introduces the GAN framework — a generator and discriminator trained in a minimax game, where the generator learns to produce realistic samples that fool the discriminator.",
    tasks: [
      {
        slug: "gan-loss",
        title: "GAN Minimax Loss",
        difficulty: "easy",
        category: "Micro",
        solveCount: 334,
        description: `# GAN Minimax Loss

## Problem Description

The original GAN objective is a two-player minimax game:

\`\`\`
min_G max_D V(D, G) = E[log D(x)] + E[log(1 - D(G(z)))]
\`\`\`

In practice we train them with separate losses:

**Discriminator loss:**
\`\`\`
L_D = -E[log D(x_real)] - E[log(1 - D(x_fake))]
\`\`\`

**Generator loss (non-saturating):**
\`\`\`
L_G = -E[log D(x_fake)]
\`\`\`

## Your Task

Implement both discriminator and generator losses given raw logits from D.`,
        skeleton: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def discriminator_loss(real_logits: np.ndarray, fake_logits: np.ndarray) -> float:
    """
    Discriminator loss: wants real=1, fake=0.
    Args:
        real_logits: D output for real samples (batch,)
        fake_logits: D output for fake samples (batch,)
    Returns:
        Scalar loss
    """
    # YOUR CODE HERE
    raise NotImplementedError

def generator_loss(fake_logits: np.ndarray) -> float:
    """
    Generator loss (non-saturating): wants fake=1.
    Args:
        fake_logits: D output for generated samples (batch,)
    Returns:
        Scalar loss
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def test_perfect_discriminator():
    real = np.array([100.0, 100.0])
    fake = np.array([-100.0, -100.0])
    loss = discriminator_loss(real, fake)
    assert loss < 0.01, f"Perfect D should have near-zero loss, got {loss}"
    print("Perfect discriminator test passed")

def test_generator_loss_decreases():
    bad  = generator_loss(np.array([-5.0, -5.0]))
    good = generator_loss(np.array([ 5.0,  5.0]))
    assert good < bad, "Better fake logits should yield lower generator loss"
    print("Generator loss direction test passed")`,
      },
    ],
  },

  {
    slug: "bert-pre-training",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    year: 2018,
    authors: ["Devlin", "Chang", "Lee", "Toutanova"],
    tags: ["NLP", "Transformer", "Pre-training"],
    paperUrl: "https://arxiv.org/abs/1810.04805",
    description:
      "Introduces bidirectional pre-training of Transformers using Masked Language Modeling (MLM) and Next Sentence Prediction, achieving state-of-the-art on 11 NLP benchmarks.",
    tasks: [
      {
        slug: "masked-language-model-loss",
        title: "Masked Language Model Loss",
        difficulty: "medium",
        category: "Micro",
        solveCount: 203,
        description: `# Masked Language Model (MLM) Loss

## Problem Description

BERT is pre-trained with **Masked Language Modeling**: 15% of tokens are randomly masked, and the model learns to predict the original token.

The loss is standard cross-entropy, but only computed on the **masked positions** — not on the full sequence.

## Formula

\`\`\`
L_MLM = -1/|M| * Σ_{i∈M} log P(token_i | context)
\`\`\`

Where M is the set of masked positions.

## Your Task

Implement MLM loss given logits for all positions and a boolean mask indicating which positions were masked.`,
        skeleton: `import numpy as np

def mlm_loss(logits: np.ndarray, targets: np.ndarray, mask: np.ndarray) -> float:
    """
    Compute masked language model loss.

    Args:
        logits:  Shape (batch, seq_len, vocab_size) - raw scores
        targets: Shape (batch, seq_len) - integer token ids
        mask:    Shape (batch, seq_len) - True where token is masked

    Returns:
        Scalar average loss over masked positions
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_only_masked_positions():
    np.random.seed(42)
    B, T, V = 2, 5, 10
    logits  = np.random.randn(B, T, V)
    targets = np.random.randint(0, V, (B, T))
    mask    = np.zeros((B, T), dtype=bool)
    mask[:, 0] = True  # only first position masked

    loss_full = mlm_loss(logits, targets, np.ones((B, T), dtype=bool))
    loss_one  = mlm_loss(logits, targets, mask)
    # They should differ (loss is averaged over different counts)
    assert loss_full != loss_one
    print("Masking test passed")

def test_perfect_prediction():
    B, T, V = 1, 3, 5
    targets = np.array([[2, 0, 4]])
    mask    = np.ones((B, T), dtype=bool)
    logits  = np.full((B, T, V), -1e9)
    for t in range(T):
        logits[0, t, targets[0, t]] = 1e9
    loss = mlm_loss(logits, targets, mask)
    assert loss < 0.01, f"Perfect prediction loss should be ~0, got {loss}"
    print("Perfect prediction test passed")`,
      },
    ],
  },

  {
    slug: "word2vec",
    title: "Distributed Representations of Words (Word2Vec)",
    year: 2013,
    authors: ["Mikolov", "Chen", "Corrado", "Dean"],
    tags: ["NLP", "Embeddings", "Unsupervised"],
    paperUrl: "https://arxiv.org/abs/1301.3781",
    description:
      "Introduces efficient neural network models (Skip-Gram and CBOW) that learn dense vector representations of words capturing semantic and syntactic relationships.",
    tasks: [
      {
        slug: "skipgram-loss",
        title: "Skip-Gram Negative Sampling Loss",
        difficulty: "medium",
        category: "Micro",
        solveCount: 156,
        description: `# Skip-Gram with Negative Sampling

## Problem Description

Word2Vec's Skip-Gram model learns word embeddings by predicting context words from a center word.

With **Negative Sampling (NEG)**, the loss for a (center, context) pair is:

\`\`\`
L = -log σ(v_c · v_o) - Σ_{k=1}^{K} log σ(-v_c · v_k)
\`\`\`

Where:
- v_c = center word embedding
- v_o = positive (true) context embedding
- v_k = negative sample embeddings (K random words)
- σ = sigmoid function

## Your Task

Implement the Skip-Gram negative sampling loss given pre-computed dot products.`,
        skeleton: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def skipgram_neg_sampling_loss(
    pos_score: float,
    neg_scores: np.ndarray
) -> float:
    """
    Skip-gram negative sampling loss.

    Args:
        pos_score:  Dot product of center and TRUE context embedding (scalar)
        neg_scores: Dot products of center with NEGATIVE samples (K,)

    Returns:
        Scalar loss
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def test_perfect_score():
    # High positive score, very negative negs → low loss
    loss = skipgram_neg_sampling_loss(10.0, np.array([-10.0, -10.0, -10.0]))
    assert loss < 0.01, f"Expected near-zero loss, got {loss}"
    print("Perfect score test passed")

def test_loss_direction():
    good = skipgram_neg_sampling_loss( 5.0, np.array([-5.0, -5.0]))
    bad  = skipgram_neg_sampling_loss(-5.0, np.array([ 5.0,  5.0]))
    assert good < bad, "Better scores should produce lower loss"
    print("Loss direction test passed")`,
      },
    ],
  },

  {
    slug: "alexnet-relu",
    title: "ImageNet Classification with Deep CNNs (AlexNet)",
    year: 2012,
    authors: ["Krizhevsky", "Sutskever", "Hinton"],
    tags: ["Computer Vision", "CNN", "Deep Learning"],
    paperUrl: "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
    description:
      "The deep CNN that won ILSVRC 2012 by a large margin, popularizing ReLU activations, dropout, data augmentation, and GPU-accelerated training for computer vision.",
    tasks: [
      {
        slug: "relu-activation",
        title: "ReLU Activation & Variants",
        difficulty: "easy",
        category: "Micro",
        solveCount: 821,
        description: `# ReLU and Its Variants

## Problem Description

AlexNet popularized **ReLU** as the default activation function, dramatically speeding up training compared to sigmoid/tanh.

## Variants

\`\`\`
ReLU:   f(x) = max(0, x)
Leaky:  f(x) = x if x > 0 else α·x
ELU:    f(x) = x if x > 0 else α(eˣ - 1)
\`\`\`

## Your Task

Implement all three activation functions.`,
        skeleton: `import numpy as np

def relu(x: np.ndarray) -> np.ndarray:
    """Standard ReLU: max(0, x)"""
    # YOUR CODE HERE
    raise NotImplementedError

def leaky_relu(x: np.ndarray, alpha: float = 0.01) -> np.ndarray:
    """Leaky ReLU: x if x>0 else alpha*x"""
    # YOUR CODE HERE
    raise NotImplementedError

def elu(x: np.ndarray, alpha: float = 1.0) -> np.ndarray:
    """ELU: x if x>0 else alpha*(exp(x)-1)"""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_relu():
    x = np.array([-3.0, -1.0, 0.0, 1.0, 3.0])
    out = relu(x)
    expected = np.array([0.0, 0.0, 0.0, 1.0, 3.0])
    np.testing.assert_allclose(out, expected)
    print("ReLU test passed")

def test_leaky_relu():
    x = np.array([-2.0, 0.0, 2.0])
    out = leaky_relu(x, alpha=0.1)
    expected = np.array([-0.2, 0.0, 2.0])
    np.testing.assert_allclose(out, expected)
    print("Leaky ReLU test passed")

def test_elu():
    x = np.array([-1.0, 0.0, 1.0])
    out = elu(x, alpha=1.0)
    assert out[1] == 0.0
    assert out[2] == 1.0
    assert out[0] < 0
    print("ELU test passed")`,
      },
      {
        slug: "max-pooling",
        title: "Max Pooling",
        difficulty: "easy",
        category: "Micro",
        solveCount: 643,
        description: `# Max Pooling

## Problem Description

Max pooling reduces spatial dimensions by taking the maximum value in each window, providing translation invariance.

## Operation

For a 2D input with a kernel of size k and stride s:
\`\`\`
output[i, j] = max(input[i*s : i*s+k, j*s : j*s+k])
\`\`\`

## Your Task

Implement 2D max pooling for a single feature map (no batches or channels).`,
        skeleton: `import numpy as np

def max_pool2d(x: np.ndarray, kernel_size: int = 2, stride: int = 2) -> np.ndarray:
    """
    2D max pooling on a single feature map.

    Args:
        x:           Input of shape (H, W)
        kernel_size: Size of pooling window
        stride:      Step size between windows

    Returns:
        Pooled output of shape (H_out, W_out)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_basic_pooling():
    x = np.array([[1, 3, 2, 4],
                  [5, 6, 7, 8],
                  [3, 2, 1, 0],
                  [1, 2, 3, 4]], dtype=float)
    out = max_pool2d(x, kernel_size=2, stride=2)
    expected = np.array([[6, 8], [3, 4]], dtype=float)
    np.testing.assert_allclose(out, expected)
    print("Basic pooling test passed")

def test_output_shape():
    x = np.random.randn(8, 8)
    out = max_pool2d(x, kernel_size=2, stride=2)
    assert out.shape == (4, 4), f"Expected (4,4), got {out.shape}"
    print("Shape test passed")`,
      },
    ],
  },
];

export const difficultyConfig = {
  easy: { label: "Easy", color: "#10b981", weight: 1 },
  medium: { label: "Medium", color: "#f59e0b", weight: 2 },
  hard: { label: "Hard", color: "#ef4444", weight: 3 },
};

// Tag colors for the filter chips
export const tagColors: Record<string, string> = {
  "NLP": "#8b5cf6",
  "Transformer": "#6366f1",
  "Attention": "#3b82f6",
  "Deep Learning": "#06b6d4",
  "Optimization": "#14b8a6",
  "Normalization": "#10b981",
  "Regularization": "#22c55e",
  "Foundational": "#f59e0b",
  "Neural Networks": "#f97316",
  "Information Theory": "#ef4444",
  "ML": "#ec4899",
  "Classification": "#d946ef",
  "Kernel Methods": "#a855f7",
};

// Helper to find a paper by slug
export function getPaperBySlug(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}

// Helper to find a task within a paper
export function getTaskBySlug(paperSlug: string, taskSlug: string): { paper: Paper; task: Task } | undefined {
  const paper = getPaperBySlug(paperSlug);
  if (!paper) return undefined;
  const task = paper.tasks.find((t) => t.slug === taskSlug);
  if (!task) return undefined;
  return { paper, task };
}

// Get all unique tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  papers.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
